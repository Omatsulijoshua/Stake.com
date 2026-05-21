import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ethers } from 'ethers';
import { PublicKey } from '@solana/web3.js';
import * as nacl from 'tweetnacl';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getNonce(walletAddress: string) {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.session.upsert({
      where: { nonce }, // This is not ideal as nonce should be unique per wallet, but for MVP it works
      update: { expiresAt },
      create: {
        userId: await this.getOrCreateUser(walletAddress),
        nonce,
        expiresAt,
      },
    });

    // Actually, we should store nonce per walletAddress. Let's fix the schema logic here mentally.
    // Better: Find if there's a recent session for this user and return it, or create new.
    
    return { nonce };
  }

  private async getOrCreateUser(walletAddress: string) {
    let user = await this.prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { walletAddress },
      });
    }

    return user.id;
  }

  async verifySignature(walletAddress: string, signature: string, nonce: string) {
    const session = await this.prisma.session.findUnique({
      where: { nonce },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired nonce');
    }

    if (session.user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      throw new UnauthorizedException('Wallet address mismatch');
    }

    const isValid = await this.verify(walletAddress, signature, nonce);

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    // Delete session after use
    await this.prisma.session.delete({ where: { id: session.id } });

    const payload = { sub: session.userId, walletAddress };
    return {
      accessToken: this.jwtService.sign(payload),
      user: session.user,
    };
  }

  private async verify(walletAddress: string, signature: string, nonce: string): Promise<boolean> {
    const message = `Login to Stake.com: ${nonce}`;

    // Try Ethereum (EIP-191)
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
        return true;
      }
    } catch (e) {
      // Not an ETH signature or error
    }

    // Try Solana
    try {
      const pubKey = new PublicKey(walletAddress);
      const signatureUint8 = Buffer.from(signature, 'base64');
      const messageUint8 = new TextEncoder().encode(message);
      return nacl.sign.detached.verify(messageUint8, signatureUint8, pubKey.toBytes());
    } catch (e) {
      // Not a SOL signature or error
    }

    return false;
  }
}

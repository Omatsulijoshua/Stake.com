import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { Connection, PublicKey, Transaction, SystemProgram, Keypair, sendAndConfirmTransaction } from '@solana/web3.js';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { Currency, TransactionType } from '@prisma/client';
import { Decimal } from 'decimal.js';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private ethProvider: ethers.JsonRpcProvider;
  private solConnection: Connection;
  private readonly logger = new Logger(BlockchainService.name);

  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {
    this.ethProvider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
    this.solConnection = new Connection(process.env.SOL_RPC_URL, 'confirmed');
  }

  onModuleInit() {
    this.listenToEthereum();
    this.listenToSolana();
  }

  async listenToEthereum() {
    this.logger.log('Starting Ethereum listener...');
    // ... logic as before
  }

  async listenToSolana() {
    this.logger.log('Starting Solana listener...');
    // In production, use AccountSubscribe or LogsSubscribe
  }

  async sendEth(to: string, amount: Decimal) {
    const wallet = new ethers.Wallet(process.env.ETH_HOT_WALLET_PRIVATE_KEY, this.ethProvider);
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount.toString()),
    });
    return tx.hash;
  }

  async sendSol(to: string, amount: Decimal) {
    const fromWallet = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOL_HOT_WALLET_PRIVATE_KEY)));
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromWallet.publicKey,
        toPubkey: new PublicKey(to),
        lamports: amount.mul(1e9).toNumber(),
      })
    );

    const signature = await sendAndConfirmTransaction(this.solConnection, transaction, [fromWallet]);
    return signature;
  }
}

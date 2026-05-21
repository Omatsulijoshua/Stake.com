import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Currency, TransactionType, Network, TransactionStatus } from '@prisma/client';
import { Decimal } from 'decimal.js';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });
    return user?.balance || new Decimal(0);
  }

  async updateBalance(userId: string, amount: Decimal, type: TransactionType, txHash?: string, currency: Currency = Currency.ETH) {
    return await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new Error('User not found');

      const newBalance = new Decimal(user.balance).add(amount);

      if (newBalance.lt(0)) {
        throw new BadRequestException('Insufficient balance');
      }

      await tx.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });

      return await tx.transaction.create({
        data: {
          userId,
          amount,
          type,
          currency,
          txHash,
          status: TransactionStatus.COMPLETED,
          network: currency === Currency.SOL ? Network.SOLANA : Network.ETHEREUM,
        },
      });
    });
  }

  async requestWithdrawal(userId: string, amount: Decimal, currency: Currency) {
    const balance = await this.getBalance(userId);
    if (balance.lt(amount)) {
      throw new BadRequestException('Insufficient balance');
    }

    // Deduct balance immediately and create a pending withdrawal request
    return await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });

      return await tx.withdrawalRequest.create({
        data: {
          userId,
          amount,
          currency,
          status: 'PENDING',
        },
      });
    });
  }
}

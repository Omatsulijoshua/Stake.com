import { PrismaService } from '../prisma/prisma.service';
import { Currency, TransactionType } from '@prisma/client';
import { Decimal } from 'decimal.js';
export declare class WalletService {
    private prisma;
    constructor(prisma: PrismaService);
    getBalance(userId: string): Promise<any>;
    updateBalance(userId: string, amount: Decimal, type: TransactionType, txHash?: string, currency?: Currency): Promise<any>;
    requestWithdrawal(userId: string, amount: Decimal, currency: Currency): Promise<any>;
}

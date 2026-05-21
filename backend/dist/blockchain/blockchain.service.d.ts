import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { Decimal } from 'decimal.js';
export declare class BlockchainService implements OnModuleInit {
    private prisma;
    private walletService;
    private ethProvider;
    private solConnection;
    private readonly logger;
    constructor(prisma: PrismaService, walletService: WalletService);
    onModuleInit(): void;
    listenToEthereum(): Promise<void>;
    listenToSolana(): Promise<void>;
    sendEth(to: string, amount: Decimal): Promise<string>;
    sendSol(to: string, amount: Decimal): Promise<string>;
}

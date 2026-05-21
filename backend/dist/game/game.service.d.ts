import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { FairService } from './fair.service';
import { Decimal } from 'decimal.js';
export declare class GameService {
    private prisma;
    private walletService;
    private fairService;
    constructor(prisma: PrismaService, walletService: WalletService, fairService: FairService);
    playDice(userId: string, amount: Decimal, target: number, condition: 'over' | 'under'): Promise<{
        bet: any;
        resultValue: number;
        isWin: boolean;
        serverSeed: string;
    }>;
    playRoulette(userId: string, amount: Decimal, betType: 'red' | 'black' | 'green'): Promise<{
        resultValue: number;
        isWin: boolean;
        payout: Decimal;
    }>;
}

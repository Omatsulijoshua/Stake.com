import { WalletService } from './wallet.service';
import { Currency } from '@prisma/client';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getBalance(req: any): Promise<{
        balance: any;
    }>;
    withdraw(req: any, amount: string, currency: Currency): Promise<any>;
}

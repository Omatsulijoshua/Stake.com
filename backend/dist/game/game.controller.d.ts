import { GameService } from './game.service';
import { Decimal } from 'decimal.js';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    playDice(req: any, amount: string, target: number, condition: 'over' | 'under'): Promise<{
        bet: any;
        resultValue: number;
        isWin: boolean;
        serverSeed: string;
    }>;
    playRoulette(req: any, amount: string, betType: 'red' | 'black' | 'green'): Promise<{
        resultValue: number;
        isWin: boolean;
        payout: Decimal;
    }>;
}

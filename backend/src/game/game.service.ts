import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { FairService } from './fair.service';
import { GameType, BetResult, TransactionType } from '@prisma/client';
import { Decimal } from 'decimal.js';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
    private fairService: FairService,
  ) {}

  async playDice(userId: string, amount: Decimal, target: number, condition: 'over' | 'under') {
    const MIN_BET = new Decimal('0.0001');
    const MAX_BET = new Decimal('100');
    const MAX_WIN = new Decimal('500');

    if (amount.lt(MIN_BET)) throw new BadRequestException('Bet amount too low');
    if (amount.gt(MAX_BET)) throw new BadRequestException('Bet amount too high');
    if (target < 0.01 || target > 99.99) throw new BadRequestException('Invalid target');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status === 'SUSPENDED') {
      throw new BadRequestException('Account suspended or not found');
    }

    const balance = await this.walletService.getBalance(userId);
    if (balance.lt(amount)) throw new BadRequestException('Insufficient balance');

    // 1. Get or create game session
    const serverSeed = this.fairService.generateServerSeed();
    const hash = this.fairService.hashServerSeed(serverSeed);
    
    // In a real app, we'd use a persistent game session for the user
    const gameSession = await this.prisma.gameSession.create({
      data: {
        gameType: GameType.DICE,
        serverSeed,
        hash,
        nonce: 1, // simplified
      },
    });

    // 2. Generate result
    const clientSeed = 'default_client_seed'; // In production, user provides this
    const resultValue = this.fairService.generateResult(serverSeed, clientSeed, gameSession.nonce) * 100;
    
    let isWin = false;
    if (condition === 'over') {
      isWin = resultValue > target;
    } else {
      isWin = resultValue < target;
    }

    // 3. Calculate payout
    // Simplified house edge logic: 99% return
    const winChance = condition === 'over' ? 100 - target : target;
    const multiplier = winChance > 0 ? new Decimal(99).div(winChance) : new Decimal(0);
    const payout = isWin ? amount.mul(multiplier) : new Decimal(0);

    // 4. Update balance and record bet
    await this.walletService.updateBalance(
      userId,
      isWin ? payout.sub(amount) : amount.neg(),
      isWin ? TransactionType.BET_WIN : TransactionType.BET_PLACE
    );

    const bet = await this.prisma.bet.create({
      data: {
        userId,
        gameType: GameType.DICE,
        amount,
        multiplier,
        payout,
        result: isWin ? BetResult.WIN : BetResult.LOSS,
        gameSessionId: gameSession.id,
      },
    });

    return {
      bet,
      resultValue,
      isWin,
      serverSeed, // Reveal server seed after play for verification
    };
  }

  async playRoulette(userId: string, amount: Decimal, betType: 'red' | 'black' | 'green') {
    const balance = await this.walletService.getBalance(userId);
    if (balance.lt(amount)) throw new BadRequestException('Insufficient balance');

    const serverSeed = this.fairService.generateServerSeed();
    const resultValue = Math.floor(this.fairService.generateResult(serverSeed, 'client_seed', 1) * 37);
    
    const ROULETTE_RED = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    
    let isWin = false;
    let multiplier = new Decimal(0);

    if (betType === 'green' && resultValue === 0) {
      isWin = true;
      multiplier = new Decimal(14);
    } else if (betType === 'red' && ROULETTE_RED.includes(resultValue)) {
      isWin = true;
      multiplier = new Decimal(2);
    } else if (betType === 'black' && resultValue !== 0 && !ROULETTE_RED.includes(resultValue)) {
      isWin = true;
      multiplier = new Decimal(2);
    }

    const payout = isWin ? amount.mul(multiplier) : new Decimal(0);

    await this.walletService.updateBalance(
      userId,
      isWin ? payout.sub(amount) : amount.neg(),
      isWin ? TransactionType.BET_WIN : TransactionType.BET_PLACE
    );

    return { resultValue, isWin, payout };
  }
}

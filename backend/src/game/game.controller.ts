import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Decimal } from 'decimal.js';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('dice')
  async playDice(
    @Request() req,
    @Body('amount') amount: string,
    @Body('target') target: number,
    @Body('condition') condition: 'over' | 'under',
  ) {
    return this.gameService.playDice(req.user.id, new Decimal(amount), target, condition);
  }

  @Post('roulette')
  async playRoulette(
    @Request() req,
    @Body('amount') amount: string,
    @Body('betType') betType: 'red' | 'black' | 'green',
  ) {
    return this.gameService.playRoulette(req.user.id, new Decimal(amount), betType);
  }
}

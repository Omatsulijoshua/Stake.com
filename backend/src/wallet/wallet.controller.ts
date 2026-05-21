import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Currency } from '@prisma/client';
import { Decimal } from 'decimal.js';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    return { balance: await this.walletService.getBalance(req.user.id) };
  }

  @Post('withdraw')
  async withdraw(@Request() req, @Body('amount') amount: string, @Body('currency') currency: Currency) {
    return this.walletService.requestWithdrawal(req.user.id, new Decimal(amount), currency);
  }
}

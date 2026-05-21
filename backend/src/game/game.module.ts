import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { FairService } from './fair.service';
import { WalletModule } from '../wallet/wallet.module';
import { GameGateway } from './game.gateway';

@Module({
  imports: [WalletModule],
  providers: [GameService, FairService, GameGateway],
  controllers: [GameController],
})
export class GameModule {}

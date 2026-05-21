import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeGames = new Map<string, any>();

  constructor(
    private gameService: GameService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new UnauthorizedException();
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub;
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_crash')
  handleJoinCrash(client: Socket) {
    client.join('crash_game');
  }

  // Example of starting a Crash round (triggered by a worker or admin)
  async startCrashRound() {
    const crashPoint = 2.5; // Placeholder for logic: 1 / (1 - Math.random()) with house edge
    let currentMultiplier = 1.0;
    
    const interval = setInterval(() => {
      currentMultiplier += 0.01 * Math.pow(currentMultiplier, 1.2);
      
      if (currentMultiplier >= crashPoint) {
        this.server.to('crash_game').emit('crash_result', { multiplier: currentMultiplier, crashed: true });
        clearInterval(interval);
      } else {
        this.server.to('crash_game').emit('crash_update', { multiplier: currentMultiplier });
      }
    }, 100);
  }
}

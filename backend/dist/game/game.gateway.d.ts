import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { JwtService } from '@nestjs/jwt';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private gameService;
    private jwtService;
    server: Server;
    private activeGames;
    constructor(gameService: GameService, jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinCrash(client: Socket): void;
    startCrashRound(): Promise<void>;
}

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
export declare class ChatGateway {
    private jwtService;
    server: Server;
    constructor(jwtService: JwtService);
    handleMessage(client: Socket, data: {
        text: string;
    }): void;
}

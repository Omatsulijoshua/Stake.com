import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  @SubscribeMessage('send_message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { text: string },
  ) {
    // In production, verify user from token in client.data
    const userId = client.data.userId || 'Anonymous';
    const walletAddress = client.data.walletAddress || '0x...';

    const message = {
      id: Date.now().toString(),
      user: walletAddress.substring(0, 6) + '...' + walletAddress.substring(38),
      text: data.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    this.server.emit('receive_message', message);
  }
}

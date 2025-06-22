import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as cookie from 'cookie';

@WebSocketGateway({ cors: true })
export class VoteGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private voteService: VoteService,
    private jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const cookieHeader = client.handshake.headers.cookie;
      if (!cookieHeader) throw new UnauthorizedException('No cookies sent');

      const cookies = cookie.parse(cookieHeader);
      const token = cookies['accessToken'];
      if (!token) throw new UnauthorizedException('No token cookie');

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = payload;

      console.log(`✅ Client connected: ${client.id} as user ${payload.id}`);
    } catch (err) {
      console.log(`❌ Socket auth failed: ${err.message}`);
      client.disconnect();
    }
    // const { roomId } = client.handshake.query;
    // if (roomId) client.join(roomId as string);
  }

  handleDisconnect(client: Socket) {
    const { roomId } = client.handshake.query;
    if (roomId) client.leave(roomId as string);
  }

  @SubscribeMessage('castVote')
  async handleCastVote(
    @MessageBody() voteDto: VoteDto & { userId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.data.user?.id || null;
      const vote = await this.voteService.castVote(voteDto, userId);

      // Fetch updated vote counts per option (you'll need to implement this in VoteService)
      const updatedOptions = await this.voteService.getOptionsWithVoteCounts(
        voteDto.roomId,
      );

      // Broadcast updated votes info to all clients in the room
      this.server
        .to(voteDto.roomId)
        .emit('voteUpdate', { vote, updatedOptions });
      console.log('Received vote update:', vote, updatedOptions);
      return { status: 'success', vote };
    } catch (error) {
      client.emit('voteError', {
        message: error.message || 'Failed to cast vote',
      });
      return {
        status: 'error',
        message: error.message || 'Failed to cast vote',
      };
    }
  }
}

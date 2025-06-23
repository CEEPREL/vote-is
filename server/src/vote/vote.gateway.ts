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

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://localhost:3001',
    credentials: true,
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
  },
})
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

      console.log(` Client connected: ${client.id} as user ${payload.id}`);
    } catch (err) {
      console.log(` Socket auth failed: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // Optionally clean up rooms or notify others
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (data.roomId) {
      client.join(data.roomId);
      client.to(data.roomId).emit('userJoined', `someone joined the room`);
    }
  }

  @SubscribeMessage('castVote')
  async handleCastVote(
    @MessageBody() voteDto: VoteDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = client.data.user;
      if (!user) throw new UnauthorizedException('Not authenticated');
      const vote = await this.voteService.castVote(voteDto, user.id);
      const updatedOptions = await this.voteService.getOptionsWithVoteCounts(
        voteDto.roomId,
      );

      this.server.to(voteDto.roomId).emit('voteUpdate', {
        optionId: vote.optionId,
        updatedOptions,
      });

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

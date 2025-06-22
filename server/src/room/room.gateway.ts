import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
})
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Connected: ${client.data} ${client.id} `);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Disconnected: ${client.id}`);
  }

  broadcastRoomCreated(room: any) {
    this.server.emit('roomCreated', room);
  }
}

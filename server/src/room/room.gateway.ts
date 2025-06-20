import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  broadcastRoomCreated(room: any) {
    this.server.emit('roomCreated', room);
  }
}

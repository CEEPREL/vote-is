import { Server, Socket } from 'socket.io';
export declare class RoomGateway {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastRoomCreated(room: any): void;
}

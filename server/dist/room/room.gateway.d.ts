import { Server } from 'socket.io';
export declare class RoomGateway {
    server: Server;
    broadcastRoomCreated(room: any): void;
}

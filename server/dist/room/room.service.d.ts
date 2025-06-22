import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomGateway } from './room.gateway';
export declare class RoomService {
    private readonly prisma;
    private readonly roomGateway;
    constructor(prisma: PrismaService, roomGateway: RoomGateway);
    createRoom(dto: CreateRoomDto, userId: string): Promise<{
        options: {
            id: string;
            text: string;
            roomId: string;
        }[];
        title: string;
        description: string;
        deadline: Date;
    }>;
    getRoomBySlug(id: string): Promise<{
        options: ({
            votes: {
                id: string;
                userId: string | null;
                roomId: string;
                createdAt: Date;
                optionId: string;
            }[];
        } & {
            id: string;
            text: string;
            roomId: string;
        })[];
        creator: {
            username: string;
        };
    } & {
        id: string;
        title: string;
        description: string;
        creatorId: string;
        deadline: Date;
    }>;
    getRoomsForUser(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
    }[]>;
}

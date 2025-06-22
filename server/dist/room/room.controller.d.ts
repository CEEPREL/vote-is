import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';
import { Request } from 'express';
export declare class RoomController {
    private readonly roomService;
    constructor(roomService: RoomService);
    create(dto: CreateRoomDto, req: Request): Promise<{
        options: {
            id: string;
            text: string;
            roomId: string;
        }[];
        description: string;
        title: string;
        deadline: Date;
    }>;
    getRoomBySlug(id: string): Promise<{
        statusCode: number;
        message: string;
        data: {
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
            description: string;
            id: string;
            title: string;
            creatorId: string;
            deadline: Date;
        };
    }>;
}

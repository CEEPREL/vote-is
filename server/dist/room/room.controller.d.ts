import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';
import { Request } from 'express';
import { VoteService } from 'src/vote/vote.service';
export declare class RoomController {
    private readonly roomService;
    private readonly voteService;
    constructor(roomService: RoomService, voteService: VoteService);
    create(dto: CreateRoomDto, req: Request): Promise<{
        options: {
            id: string;
            text: string;
            roomId: string;
        }[];
        title: string;
        description: string;
        deadline: Date;
    }>;
    getUserRooms(req: any): Promise<{
        id: string;
        title: string;
        description: string;
    }[]>;
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
            id: string;
            title: string;
            description: string;
            creatorId: string;
            deadline: Date;
        };
    }>;
}

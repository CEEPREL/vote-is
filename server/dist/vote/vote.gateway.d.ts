import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
import { JwtService } from '@nestjs/jwt';
export declare class VoteGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private voteService;
    private jwtService;
    server: Server;
    constructor(voteService: VoteService, jwtService: JwtService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleCastVote(voteDto: VoteDto & {
        userId?: string;
    }, client: Socket): Promise<{
        status: string;
        vote: {
            id: string;
            userId: string | null;
            roomId: string;
            createdAt: Date;
            optionId: string;
        };
        message?: undefined;
    } | {
        status: string;
        message: any;
        vote?: undefined;
    }>;
}

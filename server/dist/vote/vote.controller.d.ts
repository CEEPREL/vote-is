import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
export declare class VoteController {
    private voteService;
    constructor(voteService: VoteService);
    vote(voteDto: VoteDto, req: any): Promise<{
        message: string;
        vote: {
            id: string;
            userId: string | null;
            roomId: string;
            createdAt: Date;
            optionId: string;
        };
    }>;
    getVotesForRoom(roomId: string): Promise<{
        message: string;
        votes: {
            title: string;
            options: {
                voteCount: number;
                votes: {
                    id: string;
                    userId: string | null;
                    roomId: string;
                    createdAt: Date;
                    optionId: string;
                }[];
                id: string;
                text: string;
                roomId: string;
            }[];
        };
    }>;
}

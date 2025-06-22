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
}

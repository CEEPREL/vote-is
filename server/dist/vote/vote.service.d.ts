import { PrismaService } from 'src/prisma/prisma.service';
import { VoteDto } from './dto/vote.dto';
export declare class VoteService {
    private prisma;
    constructor(prisma: PrismaService);
    castVote(voteDto: VoteDto, userId: string): Promise<{
        id: string;
        optionId: string;
        userId: string | null;
        roomId: string;
        createdAt: Date;
    }>;
    getOptionsWithVoteCounts(roomId: string): Promise<{
        voteCount: number;
        votes: {
            id: string;
            optionId: string;
            userId: string | null;
            roomId: string;
            createdAt: Date;
        }[];
        id: string;
        roomId: string;
        text: string;
    }[]>;
}

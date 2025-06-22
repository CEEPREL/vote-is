import { PrismaService } from 'src/prisma/prisma.service';
import { VoteDto } from './dto/vote.dto';
export declare class VoteService {
    private prisma;
    constructor(prisma: PrismaService);
    castVote(voteDto: VoteDto, userId: string): Promise<{
        id: string;
        userId: string | null;
        roomId: string;
        createdAt: Date;
        optionId: string;
    }>;
    getOptionsWithVoteCounts(roomId: string): Promise<{
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
    }>;
}

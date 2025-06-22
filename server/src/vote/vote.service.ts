import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VoteDto } from './dto/vote.dto';

@Injectable()
export class VoteService {
  constructor(private prisma: PrismaService) {}

  async castVote(voteDto: VoteDto, userId: string) {
    const { optionId, roomId } = voteDto;
    console.log('🧾 Voting Attempt by userId:', userId); // 👈

    // Validate optionId and roomId before proceeding
    try {
      const option = await this.prisma.option.findUnique({
        where: { id: optionId },
      });

      // Checks if the option exists and belongs to the specified room
      if (!option || option.roomId !== roomId) {
        throw new BadRequestException('Option does not belong to the room');
      }

      // Checks if the user has already voted in this room
      if (userId) {
        const existingVote = await this.prisma.vote.findFirst({
          where: { userId, roomId },
        });

        if (existingVote) {
          throw new BadRequestException('User has already voted in this room');
        }
      }

      // Create a new vote
      const newVote = await this.prisma.vote.create({
        data: {
          optionId,
          roomId,
          userId: userId ?? null,
        },
      });

      const { ...vote } = newVote;
      return vote;
    } catch (error) {
      console.error('VoteService Error:', error);
      throw new InternalServerErrorException('Failed to cast vote');
    }
  }

  // update vote count
  async getOptionsWithVoteCounts(roomId: string) {
    try {
      const options = await this.prisma.option.findMany({
        where: { roomId },
        include: {
          votes: true,
        },
      });
      // Calculate vote counts for each option
      const optionsWithVoteCounts = options.map((option) => ({
        ...option,
        voteCount: option.votes.length,
      }));
      return optionsWithVoteCounts;
    } catch (error) {
      console.error('VoteService Error:', error);
      throw new InternalServerErrorException(
        'Failed to get options with vote counts',
      );
    }
  }
}

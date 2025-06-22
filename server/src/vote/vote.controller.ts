import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
import { JwtAuthGuard } from 'src/jwt-token/jwt-auth.guard';

@Controller('vote')
export class VoteController {
  constructor(private voteService: VoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async vote(@Body() voteDto: VoteDto, @Req() req) {
    // user id from JWT guard attached to req.user
    const userId = req.user?.id;

    const vote = await this.voteService.castVote(voteDto, userId);

    return { message: 'Vote cast successfully', vote };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':roomId')
  async getVotesForRoom(@Param('roomId') roomId: string) {
    const votes = await this.voteService.getOptionsWithVoteCounts(roomId);
    return { message: 'Votes fetched successfully', votes };
  }
}

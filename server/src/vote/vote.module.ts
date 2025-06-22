import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { VoteGateway } from './vote.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VoteController],
  providers: [VoteService, VoteGateway, PrismaService, JwtService],
})
export class VoteModule {}

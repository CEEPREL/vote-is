import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomService } from './room.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/jwt-token/jwt-auth.guard';
import { VoteService } from 'src/vote/vote.service';

@Controller('rooms')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly voteService: VoteService,
  ) {}

  // Create a new room
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRoomDto, @Req() req: Request) {
    const user = req.user as { id: string };
    return this.roomService.createRoom(dto, user.id);
  }

  // Get all rooms by user
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserRooms(@Req() req) {
    const userId = req.user.id;
    return this.roomService.getRoomsForUser(userId);
  }

  // Get room by id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getRoomBySlug(@Param('id') id: string) {
    const room = await this.roomService.getRoomBySlug(id);
    return {
      statusCode: 200,
      message: 'Room fetched successfully',
      data: room,
    };
  }
}

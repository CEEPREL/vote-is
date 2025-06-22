import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { randomUUID } from 'crypto';
import { RoomGateway } from './room.gateway';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly roomGateway: RoomGateway,
  ) {}

  async createRoom(dto: CreateRoomDto, userId: string) {
    const slug = randomUUID();

    const room = await this.prisma.decisionRoom.create({
      data: {
        title: dto.title,
        description: dto.description,
        deadline: new Date(dto.votingDeadline),
        creatorId: userId,
        id: slug,
        options: {
          create: dto.options.map((text) => ({ text })),
        },
      },
      include: { options: true },
    });

    this.roomGateway.broadcastRoomCreated(room);
    const { id, creatorId, ...newRoom } = room;
    return newRoom;
  }

  //Get room by id
  async getRoomBySlug(id: string) {
    const room = await this.prisma.decisionRoom.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            votes: true,
          },
        },
        creator: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}

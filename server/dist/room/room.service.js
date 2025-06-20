"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto_1 = require("crypto");
const room_gateway_1 = require("./room.gateway");
let RoomService = class RoomService {
    prisma;
    roomGateway;
    constructor(prisma, roomGateway) {
        this.prisma = prisma;
        this.roomGateway = roomGateway;
    }
    async createRoom(dto, userId) {
        const slug = (0, crypto_1.randomUUID)();
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
    async getRoomBySlug(id) {
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
            throw new common_1.NotFoundException('Room not found');
        }
        return room;
    }
};
exports.RoomService = RoomService;
exports.RoomService = RoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        room_gateway_1.RoomGateway])
], RoomService);
//# sourceMappingURL=room.service.js.map
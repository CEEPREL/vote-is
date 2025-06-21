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
exports.VoteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VoteService = class VoteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async castVote(voteDto, userId) {
        const { optionId, roomId } = voteDto;
        try {
            const option = await this.prisma.option.findUnique({
                where: { id: optionId },
            });
            if (!option || option.roomId !== roomId) {
                throw new common_1.BadRequestException('Option does not belong to the room');
            }
            if (userId) {
                const existingVote = await this.prisma.vote.findFirst({
                    where: { userId, roomId },
                });
                if (existingVote) {
                    throw new common_1.BadRequestException('User has already voted in this room');
                }
            }
            const newVote = await this.prisma.vote.create({
                data: {
                    optionId,
                    roomId,
                    userId: userId ?? null,
                },
            });
            const { ...vote } = newVote;
            return vote;
        }
        catch (error) {
            console.error('VoteService Error:', error);
            throw new common_1.InternalServerErrorException('Failed to cast vote');
        }
    }
    async getOptionsWithVoteCounts(roomId) {
        try {
            const options = await this.prisma.option.findMany({
                where: { roomId },
                include: {
                    votes: true,
                },
            });
            const optionsWithVoteCounts = options.map((option) => ({
                ...option,
                voteCount: option.votes.length,
            }));
            return optionsWithVoteCounts;
        }
        catch (error) {
            console.error('VoteService Error:', error);
            throw new common_1.InternalServerErrorException('Failed to get options with vote counts');
        }
    }
};
exports.VoteService = VoteService;
exports.VoteService = VoteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VoteService);
//# sourceMappingURL=vote.service.js.map
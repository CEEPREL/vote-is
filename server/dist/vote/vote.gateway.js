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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const vote_service_1 = require("./vote.service");
const vote_dto_1 = require("./dto/vote.dto");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let VoteGateway = class VoteGateway {
    voteService;
    jwtService;
    server;
    constructor(voteService, jwtService) {
        this.voteService = voteService;
        this.jwtService = jwtService;
    }
    handleConnection(client) {
        try {
            const cookieHeader = client.handshake.auth.token;
            console.log('cookieHeader', cookieHeader);
            if (!cookieHeader)
                throw new common_1.UnauthorizedException('No token cookie');
            const payload = this.jwtService.verify(cookieHeader, {
                secret: process.env.JWT_SECRET,
            });
            client.data.user = payload;
            console.log(` Client connected: ${client.id} as user ${payload.id}`);
        }
        catch (err) {
            console.log(` Socket auth failed: ${err.message}`);
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinRoom(data, client) {
        if (data.roomId) {
            client.join(data.roomId);
            client.to(data.roomId).emit('userJoined', `someone joined the room`);
        }
    }
    handleSendMessage(data, client) {
        const { roomId, message, userName } = data;
        const timestamp = Date.now();
        this.server.to(roomId).emit('newMessage', { userName, message, timestamp });
    }
    async handleCastVote(voteDto, client) {
        try {
            const user = client.data.user;
            if (!user)
                throw new common_1.UnauthorizedException('Not authenticated');
            const vote = await this.voteService.castVote(voteDto, user.id);
            const updatedOptions = await this.voteService.getOptionsWithVoteCounts(voteDto.roomId);
            this.server.to(voteDto.roomId).emit('voteUpdate', {
                optionId: vote.optionId,
                updatedOptions,
            });
            console.log('Received vote update:', vote, updatedOptions);
            return { status: 'success', vote };
        }
        catch (error) {
            client.emit('voteError', {
                message: error.message || 'Failed to cast vote',
            });
            return {
                status: 'error',
                message: error.message || 'Failed to cast vote',
            };
        }
    }
};
exports.VoteGateway = VoteGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], VoteGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], VoteGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], VoteGateway.prototype, "handleSendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('castVote'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vote_dto_1.VoteDto,
        socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], VoteGateway.prototype, "handleCastVote", null);
exports.VoteGateway = VoteGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.CORS_ORIGIN || 'https://localhost:3001',
            credentials: true,
            methods: ['GET', 'POST'],
            transports: ['websocket', 'polling'],
        },
    }),
    __metadata("design:paramtypes", [vote_service_1.VoteService,
        jwt_1.JwtService])
], VoteGateway);
//# sourceMappingURL=vote.gateway.js.map
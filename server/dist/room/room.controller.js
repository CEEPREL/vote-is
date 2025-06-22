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
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const create_room_dto_1 = require("./dto/create-room.dto");
const room_service_1 = require("./room.service");
const jwt_auth_guard_1 = require("../jwt-token/jwt-auth.guard");
const vote_service_1 = require("../vote/vote.service");
let RoomController = class RoomController {
    roomService;
    voteService;
    constructor(roomService, voteService) {
        this.roomService = roomService;
        this.voteService = voteService;
    }
    async create(dto, req) {
        const user = req.user;
        return this.roomService.createRoom(dto, user.id);
    }
    async getUserRooms(req) {
        const userId = req.user.id;
        return this.roomService.getRoomsForUser(userId);
    }
    async getRoomBySlug(id) {
        const room = await this.roomService.getRoomBySlug(id);
        return {
            statusCode: 200,
            message: 'Room fetched successfully',
            data: room,
        };
    }
};
exports.RoomController = RoomController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_room_dto_1.CreateRoomDto, Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getUserRooms", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getRoomBySlug", null);
exports.RoomController = RoomController = __decorate([
    (0, common_1.Controller)('rooms'),
    __metadata("design:paramtypes", [room_service_1.RoomService,
        vote_service_1.VoteService])
], RoomController);
//# sourceMappingURL=room.controller.js.map
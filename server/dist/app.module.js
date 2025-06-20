"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./user/user.module");
const auth_controller_1 = require("./auth/auth.controller");
const auth_service_1 = require("./auth/auth.service");
const auth_module_1 = require("./auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const config_1 = require("@nestjs/config");
const jwt_token_service_1 = require("./jwt-token/jwt-token.service");
const user_service_1 = require("./user/user.service");
const jwt_1 = require("@nestjs/jwt");
const room_service_1 = require("./room/room.service");
const room_controller_1 = require("./room/room.controller");
const room_module_1 = require("./room/room.module");
const path = require("path");
const room_gateway_1 = require("./room/room.gateway");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: path.resolve(__dirname, '../../.env'),
            }),
            room_module_1.RoomModule,
        ],
        controllers: [app_controller_1.AppController, auth_controller_1.AuthController, room_controller_1.RoomController],
        providers: [
            app_service_1.AppService,
            auth_service_1.AuthService,
            jwt_token_service_1.JwtTokenService,
            user_service_1.UserService,
            jwt_1.JwtService,
            room_service_1.RoomService,
            room_gateway_1.RoomGateway,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
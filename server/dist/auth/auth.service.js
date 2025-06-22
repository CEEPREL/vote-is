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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
const user_service_1 = require("../user/user.service");
const config_1 = require("@nestjs/config");
const jwt_token_service_1 = require("../jwt-token/jwt-token.service");
let AuthService = class AuthService {
    prismaDB;
    userService;
    jwtTokenService;
    configService;
    constructor(prismaDB, userService, jwtTokenService, configService) {
        this.prismaDB = prismaDB;
        this.userService = userService;
        this.jwtTokenService = jwtTokenService;
        this.configService = configService;
    }
    async signUp(signUpDto) {
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        const existingUser = await this.prismaDB.user.findFirst({
            where: {
                OR: [{ email: signUpDto.email }, { username: signUpDto.username }],
            },
        });
        if (existingUser) {
            const error = new Error('Either username or email has already been chosen');
            error.statusCode = 400;
            throw error;
        }
        const user = await this.prismaDB.user.create({
            data: {
                email: signUpDto.email,
                password: hashedPassword,
                username: signUpDto.username,
            },
        });
        return {
            statusCode: 201,
            data: `User ${user.username} created successfully`,
        };
    }
    async signIn(signInDto, res) {
        const { identifier, password } = signInDto;
        try {
            const user = await this.userService.getUser(identifier);
            if (!user) {
                throw new Error('User not found');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            const { token, expiresAt } = this.jwtTokenService.generateToken(user.id, user.username, user.email);
            res.cookie('accessToken', token, {
                httpOnly: true,
                expires: expiresAt,
                secure: this.configService.getOrThrow('NODE_ENV') === 'production',
            });
            return res.status(200).json({
                message: 'Login successful',
                token,
                expiresAt,
                user: {
                    username: user.username,
                    email: user.email,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    signOut(response) {
        response.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });
        return { message: 'Successfully signed out' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_service_1.UserService,
        jwt_token_service_1.JwtTokenService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
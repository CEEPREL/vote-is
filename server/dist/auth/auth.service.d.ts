import { PrismaService } from 'src/prisma/prisma.service';
import { IAuth } from './auth.Interface';
import { SignInDto, SignUpDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { Response } from 'express';
export declare class AuthService implements IAuth {
    private readonly prismaDB;
    private readonly userService;
    private readonly jwtTokenService;
    private readonly configService;
    constructor(prismaDB: PrismaService, userService: UserService, jwtTokenService: JwtTokenService, configService: ConfigService);
    signUp(signUpDto: SignUpDto): Promise<{
        data: string;
        statusCode: number;
    }>;
    signIn(signInDto: SignInDto, res: Response): Promise<Response>;
    signOut(response: Response): {
        message: string;
    };
}

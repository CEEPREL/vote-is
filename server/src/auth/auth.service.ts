import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IAuth } from './auth.Interface';
import { SignInDto, SignUpDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { Response } from 'express';

@Injectable()
export class AuthService implements IAuth {
  constructor(
    private readonly prismaDB: PrismaService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly configService: ConfigService,
  ) {}
  //create new user method
  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ data: string; statusCode: number }> {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

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

  async signIn(signInDto: SignInDto, res: Response): Promise<Response> {
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

      const { token, expiresAt } = this.jwtTokenService.generateToken(user.id);

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
        },
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}

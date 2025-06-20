import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenService } from './jwt-token/jwt-token.service';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    JwtTokenService,
    UserService,
    JwtService,
  ],
})
export class AppModule {}

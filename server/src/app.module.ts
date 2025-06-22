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
import { RoomService } from './room/room.service';
import { RoomController } from './room/room.controller';
import { RoomModule } from './room/room.module';
import * as path from 'path';
import { RoomGateway } from './room/room.gateway';
import { VoteModule } from './vote/vote.module';
import { VoteService } from './vote/vote.service';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),

    RoomModule,

    VoteModule,
  ],
  controllers: [AppController, AuthController, RoomController],
  providers: [
    AppService,
    AuthService,
    JwtTokenService,
    UserService,
    JwtService,
    RoomService,
    RoomGateway,
    VoteService,
  ],
})
export class AppModule {}

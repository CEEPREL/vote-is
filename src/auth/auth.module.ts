import { Module } from '@nestjs/common';
import { JwtTokenService } from 'src/jwt-token/jwt-token.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [JwtTokenService, AuthService, JwtService, UserService],
  exports: [],
  controllers: [],
  imports: [],
})
export class AuthModule {}

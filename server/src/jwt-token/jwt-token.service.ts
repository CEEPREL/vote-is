import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/types/types';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(userId: string): { token: string; expiresAt: Date } {
    const expirationMs = parseInt(
      this.configService.getOrThrow('JWT_EXPIRATION'),
      10,
    );
    const expiresAt = new Date(Date.now() + expirationMs);

    const payload: TokenPayload = { id: userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: `${expirationMs}ms`,
    });

    return { token, expiresAt };
  }
}

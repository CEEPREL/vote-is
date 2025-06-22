import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  // Exxtract token from header or cookies and verifies it
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromRequest(request);
    if (!token) throw new UnauthorizedException('Token not found');

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      request.user = payload;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  // Checkes for token in header or cookies
  private extractTokenFromRequest(request: any): string | null {
    if (request.headers.authorization?.startsWith('Bearer ')) {
      return request.headers.authorization.split(' ')[1];
    }
    // Or try cookies
    if (request.cookies?.accessToken) {
      return request.cookies.accessToken;
    }
    return null;
  }
}

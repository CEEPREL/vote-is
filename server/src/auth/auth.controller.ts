import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { IAuth } from './auth.Interface';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController implements IAuth {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() signUpDto: SignUpDto,
  ): Promise<{ data: string; statusCode: number }> {
    const res = await this.authService.signUp(signUpDto);
    return res;
  }

  @Post('signin')
  @HttpCode(200) // Set default success status
  async signIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.signIn(signInDto, res);
  }
}

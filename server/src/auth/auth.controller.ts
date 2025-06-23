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
  @HttpCode(200)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.signIn(signInDto, res);
  }

  @Post('signout')
  signOut(@Res() res: Response) {
    const result = this.authService.signOut(res);
    return res.json(result);
  }
}

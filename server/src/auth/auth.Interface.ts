import { Response } from 'express';
import { SignInDto, SignUpDto } from './auth.dto';

export interface IAuth {
  signUp(
    signUpDto: SignUpDto,
    response: Response,
  ): Promise<{ data: string; statusCode: number }>;
  signIn(signInDto: SignInDto, res: Response): Promise<Response>;
  //   verifyUser(signInDto: LoginDto): Promise<{ data: string }>;
  //   requestResetPassword(): Promise<{ msg: string }>;
  //   verifyRequestResetPassword(): Promise<{ msg: string }>;
  //   updateResetPassword(): Promise<{ msg: string }>;
  //   changePassword(): Promise<{ msg: string }>;
}

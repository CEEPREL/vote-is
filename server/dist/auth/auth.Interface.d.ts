import { Response } from 'express';
import { SignInDto, SignUpDto } from './auth.dto';
export interface IAuth {
    signUp(signUpDto: SignUpDto, response: Response): Promise<{
        data: string;
        statusCode: number;
    }>;
    signIn(signInDto: SignInDto, res: Response): Promise<Response>;
}
export interface TokenPayload {
    id: string;
}

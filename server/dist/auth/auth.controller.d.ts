import { IAuth } from './auth.Interface';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './auth.dto';
import { Response } from 'express';
export declare class AuthController implements IAuth {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        data: string;
        statusCode: number;
    }>;
    signIn(signInDto: SignInDto, res: Response): Promise<Response>;
}

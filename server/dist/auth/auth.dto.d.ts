import { CreateUserDto } from 'src/user/dto/create-user.dto';
export declare class SignUpDto extends CreateUserDto {
}
export declare class SignInDto {
    identifier: string;
    password: string;
}

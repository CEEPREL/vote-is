import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((o) => !o.username)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @ValidateIf((o) => !o.email)
  username: string;
}

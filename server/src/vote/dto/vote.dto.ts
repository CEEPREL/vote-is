import { IsNotEmpty } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  optionId: string;

  @IsNotEmpty()
  roomId: string;
}

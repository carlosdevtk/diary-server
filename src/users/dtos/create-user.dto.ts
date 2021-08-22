import { IsAlphanumeric, Length, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsAlphanumeric()
  @Length(4, 16)
  username: string;

  @MinLength(6)
  password: string;
}

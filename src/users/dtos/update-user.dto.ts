import { IsAlphanumeric, IsOptional, Length, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsAlphanumeric()
  @Length(4, 16)
  @IsOptional()
  username: string;

  @MinLength(6)
  @IsOptional()
  password: string;
}

import { IsAlphanumeric, IsString, Length, Min } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'O campo username não é uma string válida' })
  @Length(4, 16, {
    message:
      'O campo username precisa ter entre $constraint1 a $constraint2 caracteres',
  })
  @IsAlphanumeric()
  username: string;

  @IsString({ message: 'O campo username não é uma string válida' })
  @Min(6, {
    message: 'A senha inserida é muito curta. Caracteres minimo $constraint1.',
  })
  password: string;
}

import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  humor: string;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;
}

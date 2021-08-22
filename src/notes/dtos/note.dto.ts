import { Expose, Transform } from 'class-transformer';

export class NoteDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  humor: string;

  @Expose()
  isPublic: boolean;

  @Expose()
  views: number;

  @Expose()
  createdAt: string;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}

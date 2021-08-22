import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  humor: string;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ default: 0 })
  views: number;
}

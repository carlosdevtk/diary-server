import { User } from 'src/users/users.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  createdAt: string;

  @ManyToOne(() => User, (user) => user.notes, { eager: true })
  user: User;

  @BeforeInsert()
  setCreatedAt() {
    const date = new Date();
    const day = date.getDate().toString();
    const finalDay = day.length === 1 ? '0' + day : day;
    const month = (date.getMonth() + 1).toString();
    const finalMonth = month.length == 1 ? '0' + month : month;
    const year = date.getFullYear();

    this.createdAt = finalDay + '/' + finalMonth + '/' + year;
  }
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Task } from '../tasks/tasks.entity';
import { User } from '../user/user.entity';

@Entity('Comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  text: string;

  @ManyToOne(() => Task, task => task.comments)
  task: Task;

  @ManyToOne(() => User, user => user.comments)
  user: User;
}

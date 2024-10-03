import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Team } from '../teams/teams.entity';
import { Comment } from '../comments/comments.entity';
import { Alert } from '../alerts/alerts.entity';

@Entity('Tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'enum', enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' })
  status: string;

  @Column({ type: 'date', nullable: true, default: () => 'NULL' })
  startDate: Date;

  @Column({ type: 'date', nullable: true, default: () => 'NULL' })
  endDate: Date;

  @Column({ type: 'int' })
  estimatedTime: number;

  @Column({ type: 'int', default: 0 })
  totalTime: number;

  @Column({ type: 'boolean', default: false })
  isPriority: boolean;

  @Column({ type: 'boolean', default: false })
  needsHelp: boolean;

  @ManyToOne(() => Team, team => team.tasks)
  team: Team;

  @ManyToOne(() => User, user => user.tasks)
  user: User;

  @OneToMany(() => Comment, comment => comment.task)
  comments: Comment[];

  @OneToMany(() => Alert, alert => alert.task)
  alerts: Alert[];
}

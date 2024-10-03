import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserTeam } from '../user-team/user-team.entity';
import { Task } from '../tasks/tasks.entity';
import { Alert } from '../alerts/alerts.entity';

@Entity('Teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column({ length: 5, unique: true })
  code: string;

  @OneToMany(() => UserTeam, userTeam => userTeam.team)
  userTeams: UserTeam[];

  @OneToMany(() => Task, task => task.team)
  tasks: Task[];

  @OneToMany(() => Alert, alert => alert.team)
  alerts: Alert[];
}

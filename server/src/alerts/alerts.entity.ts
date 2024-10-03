import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Task } from '../tasks/tasks.entity';
import { Team } from '../teams/teams.entity';
import { User } from '../user/user.entity';
import { HistoryAlert } from '../history-alerts/history-alerts.entity';

@Entity('Alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @ManyToOne(() => Task, task => task.alerts)
  task: Task;

  @ManyToOne(() => Team, team => team.alerts)
  team: Team;

  @ManyToOne(() => User, user => user.alerts)
  user: User;

  @OneToMany(() => HistoryAlert, historyAlert => historyAlert.alert)
  history: HistoryAlert[];
}
/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserTeam } from '../user-team/user-team.entity';
import { Task } from '../tasks/tasks.entity';
import { Comment } from '../comments/comments.entity';
import { Alert } from '../alerts/alerts.entity';
import { HistoryAlert } from '../history-alerts/history-alerts.entity';

@Entity({ name: 'Users' }) // Utiliser la table "Users"
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 }) // Correspond à VARCHAR(50) dans le schéma SQL
  role: string;

  @Column({
    type: 'enum',
    enum: ['available', 'notBusy', 'busy', 'na'],
    default: 'available',
  })
  status: string;

  @Column({ length: 100 }) // Correspond à VARCHAR(100) dans le schéma SQL
  firstname: string;

  @Column({ length: 100 }) // Correspond à VARCHAR(100) dans le schéma SQL
  lastname: string;

  @Column({ length: 100, unique: true }) // Correspond à VARCHAR(100) dans le schéma SQL
  email: string;

  @Column({ length: 255 }) // Correspond à VARCHAR(255) dans le schéma SQL
  password: string;

  @OneToMany(() => UserTeam, (userTeam) => userTeam.user)
  userTeams: UserTeam[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];

  @OneToMany(() => HistoryAlert, (historyAlert) => historyAlert.user)
  historyAlerts: HistoryAlert[];
}

import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Alert } from '../alerts/alerts.entity';
import { User } from '../user/user.entity';

@Entity('History_alerts')
export class HistoryAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @ManyToOne(() => Alert, alert => alert.history)
  alert: Alert;

  @ManyToOne(() => User, user => user.historyAlerts)
  user: User;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryAlertsService } from './history-alerts.service';
import { HistoryAlert } from './history-alerts.entity';
import { Alert } from '../alerts/alerts.entity';
import { User } from '../user/user.entity';
import { HistoryAlertsController } from './history-alerts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryAlert, Alert, User]),
  ],
  providers: [HistoryAlertsService],
  controllers: [HistoryAlertsController],
})
export class HistoryAlertsModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { Alert } from '../alerts/alerts.entity';
import { HistoryAlert } from '../history-alerts/history-alerts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alert, HistoryAlert])],
  providers: [AlertsService],
  controllers: [AlertsController],
})
export class AlertsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from '../alerts/alerts.entity';
import { HistoryAlert } from '../history-alerts/history-alerts.entity';
import { User } from '../user/user.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
    @InjectRepository(HistoryAlert)
    private historyAlertsRepository: Repository<HistoryAlert>,
  ) {}

  async createAlert(details: Partial<Alert>): Promise<Alert> {
    const alert = this.alertsRepository.create(details);
    const savedAlert = await this.alertsRepository.save(alert);
    await this.createHistory(savedAlert.id, savedAlert.status);
    return savedAlert;
  }

  async updateAlert(id: number, details: Partial<Alert>): Promise<Alert> {
    await this.alertsRepository.update(id, details);
    const updatedAlert = await this.alertsRepository.findOneBy({ id });
    if (updatedAlert) {
      await this.createHistory(updatedAlert.id, updatedAlert.status);
    }
    return updatedAlert;
  }

  async deleteAlert(id: number): Promise<void> {
    await this.alertsRepository.delete(id);
  }

  async assignAlertToUser(alertId: number, userId: number): Promise<Alert> {
    const alert = await this.alertsRepository.findOneBy({ id: alertId });
    alert.user = { id: userId } as User;
    const updatedAlert = await this.alertsRepository.save(alert);
    await this.createHistory(updatedAlert.id, updatedAlert.status);
    return updatedAlert;
  }

  async updateAlertStatus(alertId: number, status: string): Promise<Alert> {
    const alert = await this.alertsRepository.findOneBy({ id: alertId });
    alert.status = status;
    const updatedAlert = await this.alertsRepository.save(alert);
    await this.createHistory(updatedAlert.id, updatedAlert.status);
    return updatedAlert;
  }

  async createHistory(alertId: number, status: string): Promise<HistoryAlert> {
    const historyAlert = this.historyAlertsRepository.create({ alert: { id: alertId }, status });
    return this.historyAlertsRepository.save(historyAlert);
  }

  async findAlertHistory(alertId: number): Promise<HistoryAlert[]> {
    return this.historyAlertsRepository.find({
      where: { alert: { id: alertId } },
    });
  }

  async findUnresolvedAlerts(): Promise<Alert[]> {
    return this.alertsRepository.find({
      where: { status: 'To Do' },
      relations: ['task', 'team', 'user'],
    });
  }
}

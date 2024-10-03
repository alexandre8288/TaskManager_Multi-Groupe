import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryAlert } from './history-alerts.entity';
import { Alert } from '../alerts/alerts.entity';
import { User } from '../user/user.entity';

@Injectable()
export class HistoryAlertsService {
  constructor(
    @InjectRepository(HistoryAlert)
    private historyAlertRepository: Repository<HistoryAlert>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Ajouter une entrée dans l'historique d'une alerte
  async addHistory(alertId: number, status: string, userId: number): Promise<HistoryAlert> {
    const alert = await this.alertRepository.findOne({ where: { id: alertId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    const historyAlert = this.historyAlertRepository.create({
      status,
      alert,   // Associer l'alerte
      user,    // Associer l'utilisateur
    });
  
    return this.historyAlertRepository.save(historyAlert);
  }  

  // Récupérer l'historique d'une alerte
  async getHistoryByAlert(alertId: number): Promise<HistoryAlert[]> {
    return this.historyAlertRepository.find({
      where: { alert: { id: alertId } },
      relations: ['user'],  // Charger également les informations sur l'utilisateur qui a effectué les modifications
    });
  }
}

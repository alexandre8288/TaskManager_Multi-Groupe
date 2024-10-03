import { Controller, Post, Param, Body, Get, UseGuards } from '@nestjs/common';
import { HistoryAlertsService } from './history-alerts.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('history-alerts')
@UseGuards(JwtAuthGuard)  // Protéger les routes avec JWT
export class HistoryAlertsController {
  constructor(private readonly historyAlertsService: HistoryAlertsService) {}

  // Ajouter une nouvelle entrée dans l'historique pour une alerte
  @Post(':alertId')
  addHistory(
    @Param('alertId') alertId: number,
    @Body('status') status: string,
    @Body('userId') userId: number,
  ) {
    return this.historyAlertsService.addHistory(alertId, status, userId);
  }

  // Récupérer l'historique d'une alerte
  @Get(':alertId')
  getHistoryByAlert(@Param('alertId') alertId: number) {
    return this.historyAlertsService.getHistoryByAlert(alertId);
  }
}

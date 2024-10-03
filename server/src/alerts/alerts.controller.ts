import { Controller, Post, Put, Delete, Get, Param, Body } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { Alert } from '../alerts/alerts.entity';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  createAlert(@Body() details: Partial<Alert>) {
    return this.alertsService.createAlert(details);
  }

  @Put(':id')
  updateAlert(@Param('id') id: number, @Body() details: Partial<Alert>) {
    return this.alertsService.updateAlert(id, details);
  }

  @Delete(':id')
  deleteAlert(@Param('id') id: number) {
    return this.alertsService.deleteAlert(id);
  }

  @Put(':id/assign')
  assignAlertToUser(@Param('id') alertId: number, @Body('userId') userId: number) {
    return this.alertsService.assignAlertToUser(alertId, userId);
  }

  @Put(':id/status')
  updateAlertStatus(@Param('id') alertId: number, @Body('status') status: string) {
    return this.alertsService.updateAlertStatus(alertId, status);
  }

  @Get(':id/history')
  findAlertHistory(@Param('id') alertId: number) {
    return this.alertsService.findAlertHistory(alertId);
  }

  @Get('unresolved')
  findUnresolvedAlerts() {
    return this.alertsService.findUnresolvedAlerts();
  }
}

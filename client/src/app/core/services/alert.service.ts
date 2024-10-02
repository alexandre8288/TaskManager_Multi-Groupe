import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  private apiUrl = `${environment.apiUrl}/alerts`;

  constructor(private http: HttpClient) {}

  // Créer une nouvelle alerte
  createAlert(alertDetails: {
    taskId: number;
    teamId: number;
    userId: number;
    status: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, alertDetails);
  }

  // Modifier les détails d'une alerte existante
  updateAlert(id: number, alertDetails: { status?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, alertDetails);
  }

  // Supprimer une alerte
  deleteAlert(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Assigner une alerte à un utilisateur pour résolution
  assignAlertToUser(alertId: number, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${alertId}/assign`, { userId });
  }

  // Marquer une alerte comme "à aider", "en cours" ou "résolue"
  updateAlertStatus(alertId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${alertId}/status`, { status });
  }

  // Visualiser l'historique des alertes associées à une tâche
  getAlertHistory(alertId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${alertId}/history`);
  }

  // Récupérer les alertes non résolues
  getUnresolvedAlerts(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/unresolved`);
  }

  getHelpRequests(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/help-requests`);
  }
}

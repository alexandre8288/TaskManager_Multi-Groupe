import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryAlertsService {

  private apiUrl = `${environment.apiUrl}/history-alerts`;

  constructor(private http: HttpClient) { }

  // Récupérer l'historique des alertes pour une alerte donnée
  getHistoryByAlert(alertId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/alert/${alertId}`);
  }

  // Ajouter une nouvelle entrée d'historique pour une alerte
  addHistoryEntry(alertId: number, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { alertId, status });
  }
}

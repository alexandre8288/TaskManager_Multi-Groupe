import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private apiUrl = `${environment.apiUrl}/teams`;

  constructor(private http: HttpClient) {}

  // Créer une nouvelle équipe
  createTeam(teamDetails: {
    name: string;
    description: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, teamDetails);
  }

  // Modifier les informations d'une équipe existante
  updateTeam(
    id: number,
    teamDetails: { name?: string; description?: string }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, teamDetails);
  }

  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  // Supprimer une équipe
  deleteTeam(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Assigner un utilisateur à une équipe
  assignUserToTeam(teamId: number, userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${teamId}/users`, { userId });
  }

  // Visualiser les membres d'une équipe
  getTeamMembers(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${teamId}/users`);
  }

  // Récupérer toutes les équipes
  getAllTeams(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }

  getTeamsByUserId(userId: number): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/user-team/user/${userId}`);
  }

  checkCodeAvailability(code: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-code/${code}`);
  }

  checkCodeExists(code: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-code/${code}`);
  }

  removeUserFromTeam(teamId: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}/users/${userId}`);
  }
}

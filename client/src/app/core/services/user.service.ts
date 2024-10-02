import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) {
    console.log(this.apiUrl);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Récupérer le statut de tous les utilisateurs
  getUsersStatus(): Observable<
    { firstname: string; lastname: string; status: string }[]
  > {
    const headers = this.getAuthHeaders();
    return this.http.get<
      { firstname: string; lastname: string; status: string }[]
    >(`${this.apiUrl}/status`, { headers });
  }

  // Créer un nouvel utilisateur
  createUser(userDetails: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userDetails);
  }

  // Modifier les informations d'un utilisateur
  updateUser(
    id: number,
    userDetails: {
      role?: string;
      status?: string;
      firstname?: string;
      lastname?: string;
      email?: string;
      password?: string;
    }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userDetails);
  }

  updateUserStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Récupérer un utilisateur par ID
  getUserById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Modifier le rôle d'un utilisateur
  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/role`, { role });
  }

  // Assigner un utilisateur à une équipe
  assignUserToTeam(userId: number, teamId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/teams`, { teamId });
  }

  // Récupérer les équipes d'un utilisateur
  getUserTeams(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/teams`);
  }

  getUserTasks(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/tasks`);
  }

  addUserToTeamByCode(userId: number, teamCode: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(
      `${this.apiUrl}/${userId}/join-team`,
      { teamCode },
      { headers }
    );
  }

  fetchUserDetails(userId: number): Observable<any> {
    return this.getUserById(userId);
  }
}

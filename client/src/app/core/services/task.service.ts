import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  // Créer une nouvelle tâche
  createTask(taskDetails: {
    title: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string;
    estimatedTime: number;
    totalTime: number;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, taskDetails);
  }

  // Modifier les détails d'une tâche existante
  updateTask(
    id: number,
    taskDetails: {
      title?: string;
      description?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
      estimatedTime?: number;
      needsHelp?: boolean;
      totalTime?: number;
    }
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, taskDetails);
  }

  // Supprimer une tâche
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Assigner une tâche à un utilisateur
  assignTaskToUser(taskId: number, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}/assign`, { userId });
  }

  // Marquer une tâche comme "à faire", "en cours" ou "finie"
  updateTaskStatus(taskId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}/status`, { status });
  }

  // Enregistrer le temps passé sur chaque tâche
  logTaskTime(taskId: number, time: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${taskId}/time`, { time });
  }

  // Afficher les tâches attribuées à un utilisateur
  getTasksByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }

  // Afficher les tâches disponibles pour être attribuées
  getUnassignedTasks(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/unassigned`);
  }

  // Filtrer les tâches par équipe
  getTasksByTeam(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/team/${teamId}`);
  }

  // Associer des commentaires à une tâche
  addCommentToTask(
    taskId: number,
    comment: { userId: number; text: string }
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/${taskId}/comments`, comment);
  }

  // Récupérer les commentaires d'une tâche
  getTaskComments(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${taskId}/comments`);
  }

  // Récupérer une tâche par son ID
  getTaskById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getTasksWithHelpRequest(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alert/help`);
  }
}

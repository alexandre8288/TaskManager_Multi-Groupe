import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response && response.access_token) {
            localStorage.setItem('token', response.access_token); // Enregistrer le token dans localStorage
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getStatus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/status`);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Vérifie si le token est présent
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
  }

  removeToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
  }
}

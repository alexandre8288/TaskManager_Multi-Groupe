import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { first } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'token'; // Make sure this matches your token key

  constructor() {}

  // Get the token from localStorage
  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Decode the token
  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        console.error('Failed to decode token', e);
        return null;
      }
    }
    return null;
  }

  // Get user information from the token
  getUserInfo(): any {
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      return {
        email: decodedToken.email,
        userId: decodedToken.sub,
        // role: decodedToken.role,
        // status: decodedToken.status,
        // firstname: decodedToken.firstname,
        // lastname: decodedToken.lastname,
      };
    }
    return null;
  }
}

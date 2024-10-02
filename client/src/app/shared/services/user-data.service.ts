import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { TokenService } from '../../core/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private userSubject = new BehaviorSubject<any>(null);
  private userTeamsSubject = new BehaviorSubject<any[]>([]);
  user$: Observable<any> = this.userSubject.asObservable();
  userTeams$: Observable<any[]> = this.userTeamsSubject.asObservable();
  private userId: number | null = null;
  private userTasksSubject = new BehaviorSubject<any[]>([]);
  userTasks$: Observable<any[]> = this.userTasksSubject.asObservable();

  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) {
    this.loadUser();
  }

  private loadUser(): void {
    const userInfo = this.tokenService.getUserInfo();
    if (userInfo && userInfo.userId) {
      this.userService.getUserById(userInfo.userId).subscribe(
        (user) => {
          console.log('Fetched User Data:', user); // Log the entire user data
          this.userSubject.next(user);
          this.userId = user.id;
          console.log('User loaded:', user);
          // Access the correct property for user ID
          const userId = user.id; // Ensure this matches the actual property name
          if (userId) {
            this.loadUserTeams(userId);
            this.loadUserTasks(userId);
          } else {
            console.error('User ID is missing in user data');
          }
        },
        (error) => console.error('Error loading user data:', error)
      );
    } else {
      console.error('User info is missing or invalid');
    }
  }

  private loadUserTeams(userId: number): void {
    if (userId != null) {
      // Check if userId is not null or undefined
      this.userService.getUserTeams(userId).subscribe(
        (teams) => this.userTeamsSubject.next(teams),
        (error) => console.error('Error loading user teams:', error)
      );
    } else {
      console.error('Invalid userId for loading teams:', userId);
    }
  }

  loadUserTasks(userId: number): void {
    if (userId != null) {
      this.userService.getUserTasks(userId).subscribe(
        (tasks) => this.userTasksSubject.next(tasks),
        (error) => console.error('Error loading user tasks:', error)
      );
    } else {
      console.error('Invalid userId for loading tasks:', userId);
    }
  }

  reloadUserTasks(): void {
    const userId = this.getCurrentUserId();
    if (userId != null) {
      this.loadUserTasks(userId);
    } else {
      console.error('No userId available to reload tasks.');
    }
  }

  getCurrentUserId(): number | null {
    return this.userId;
  }

  get currentUser$(): Observable<any> {
    return this.user$;
  }

  updateUser(user: any): void {
    this.userSubject.next(user);
  }

  updateUserTeams(teams: any[]): void {
    this.userTeamsSubject.next(teams);
  }

  updateUserTasks(tasks: any[]): void {
    this.userTasksSubject.next(tasks);
  }
}

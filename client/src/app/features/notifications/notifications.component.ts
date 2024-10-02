import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserDataService } from '../../shared/services/user-data.service';
import { TasksService } from '../../core/services/task.service';
import { AlertsService } from '../../core/services/alert.service';
import { UserService } from '../../core/services/user.service';
import { TeamsService } from '../../core/services/teams.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  public notifications: any[] = [];
  private userTeams: any[] = [];
  private user: any;

  constructor(
    private userDataService: UserDataService,
    private tasksService: TasksService,
    private alertsService: AlertsService,
    private teamsService: TeamsService,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userDataService.currentUser$.subscribe((user) => {
      this.user = user;
      console.log('Current User:', this.user);

      this.userDataService.userTeams$.subscribe((teams) => {
        this.userTeams = teams;
        console.log('User Teams:', this.userTeams);
        this.fetchTasksWithHelpRequest();
      });
    });
  }

  fetchTasksWithHelpRequest(): void {
    this.tasksService.getTasksWithHelpRequest().subscribe(
      (tasks) => {
        if (!tasks || !Array.isArray(tasks)) {
          console.error('No valid tasks data available:', tasks);
          return;
        }

        console.log('Fetched Tasks:', tasks);
        console.log('User Teams:', this.userTeams);

        // Filter tasks that need help and belong to the user's teams
        this.notifications = tasks.filter((task) => {
          // Adjust to match the correct field name or path
          const teamId = task.team?.id; // Adjust if necessary
          const isInUserTeam = this.userTeams.some(
            (team) => team.id === teamId
          );
          const needsHelp = task.needsHelp === true;
          const isNotUserTask = task.userId !== this.user.id;

          console.log('Task Details:', task);
          console.log(
            'User Teams IDs:',
            this.userTeams.map((team) => team.id)
          );
          console.log('Task Team ID:', teamId);
          console.log('Is In User Team:', isInUserTeam);
          console.log('Needs Help:', needsHelp);
          console.log('Is Not User Task:', isNotUserTask);

          return isInUserTeam && needsHelp && isNotUserTask;
        });

        console.log('Filtered Notifications:', this.notifications);

        // Fetch additional details for notifications
        const teamRequests = this.notifications.map((notification) =>
          this.teamsService.getTeamById(notification.teamId)
        );
        const userRequests = this.notifications.map((notification) =>
          this.userService.getUserById(notification.userId)
        );

        forkJoin([...teamRequests, ...userRequests]).subscribe(
          (results) => {
            const teams = results.slice(0, this.notifications.length);
            const users = results.slice(this.notifications.length);

            this.notifications.forEach((notification) => {
              notification.team = teams.find(
                (team) => team.id === notification.teamId
              );
              notification.user = users.find(
                (user) => user.id === notification.userId
              );
            });

            this.cd.detectChanges();
          },
          (error) => console.error('Error fetching additional details:', error)
        );
      },
      (error) =>
        console.error('Error fetching tasks with help requests:', error)
    );
  }

  fetchTeamDetails(teamId: number): void {
    this.teamsService.getTeamById(teamId).subscribe(
      (team) => {
        console.log('Fetched Team Details:', team);
        // Attach team details to the notification
        this.notifications.forEach((notification) => {
          if (notification.teamId === teamId) {
            notification.team = team; // Update the notification with team data
          }
        });
        this.cd.detectChanges(); // Trigger change detection
      },
      (error) => console.error('Error fetching team details:', error)
    );
  }

  fetchUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        console.log('Fetched User Details:', user);
        // Attach user details to the notification
        this.notifications.forEach((notification) => {
          if (notification.userId === userId) {
            notification.user = user; // Update the notification with user data
          }
        });
        this.cd.detectChanges(); // Trigger change detection
      },
      (error) => console.error('Error fetching user details:', error)
    );
  }

  back(): void {
    this.router.navigate(['/dashboard/home']);
  }
}

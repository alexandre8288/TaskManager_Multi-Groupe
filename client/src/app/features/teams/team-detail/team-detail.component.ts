import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { StatusService } from '../../../core/services/status.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../../../core/services/teams.service';
import { TasksService } from '../../../core/services/task.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserDataService } from '../../../shared/services/user-data.service';

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailComponent implements OnInit {
  public user: any = {};
  public teamData: any = {};
  public teamId: number | null = null;

  public isManageMode: boolean = false;
  public taskCount: number = 0;
  public memberCount: number = 0;
  public tasksWithIssuesCount: number = 0;
  public progressPercentage: number = 0;
  public teamMembers: any[] = [];

  constructor(
    private statusService: StatusService,
    private route: ActivatedRoute,
    private router: Router,
    private teamsService: TeamsService,
    private tasksService: TasksService,
    private cd: ChangeDetectorRef,
    private userDataService: UserDataService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userDataService.currentUser$.subscribe(async (user) => {
      this.user = user;
      console.log('Current User:', this.user);

      const nav = this.router.getCurrentNavigation();
      if (nav?.extras?.state?.['teamData']) {
        this.teamData = nav.extras.state['teamData'];
        await this.loadTeamMembers(this.teamData.id);
        await this.calculateValues();
      } else {
        this.route.params.subscribe(async (params) => {
          this.teamId = +params['id'];
          if (this.teamId) {
            await this.fetchTeamData(this.teamId);
            await this.loadTasks(this.teamId);
            await this.loadTeamMembers(this.teamId);
          }
        });
      }
    });
  }

  async loadTasks(teamId: number): Promise<void> {
    try {
      const tasks = await this.tasksService.getTasksByTeam(teamId).toPromise();
      this.teamData.tasks = tasks;
      this.taskCount = tasks.length;
      console.log('Fetched Tasks:', tasks);
      await this.calculateValues(); // Calculate after data is loaded
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  async loadTeamMembers(teamId: number): Promise<void> {
    try {
      const members = await this.teamsService
        .getTeamMembers(teamId)
        .toPromise();
      this.teamMembers = members;
      console.log('Fetched team members:', this.teamMembers);
      this.memberCount = members.length; // Update member count here
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  }

  async fetchTeamData(teamId: number): Promise<void> {
    try {
      const team = await this.teamsService.getTeamById(teamId).toPromise();
      this.teamData = team;
      await this.calculateValues(); // Calculate after fetching team data
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  }

  async calculateValues(): Promise<void> {
    if (this.teamData.tasks) {
      // Calculate tasks with issues
      this.tasksWithIssuesCount = this.teamData.tasks.filter(
        (t: any) => t.needsHelp
      ).length;

      console.log(
        'Number of tasks with issues (needsHelp = true):',
        this.tasksWithIssuesCount
      ); // Log the number of tasks with issues

      // Calculate progress percentage
      this.progressPercentage = this.calculateProgress();
    }

    // Update member count
    this.memberCount = this.teamMembers.length;
  }

  toggleManageMode(): void {
    this.isManageMode = !this.isManageMode;
  }

  removeMember(userId: number): void {
    if (this.teamId) {
      this.teamsService.removeUserFromTeam(this.teamId, userId).subscribe(
        () => {
          this.teamMembers = this.teamMembers.filter(
            (member) => member.user.id !== userId
          );
          this.memberCount--;
          this.cd.detectChanges();
        },
        (error) => {
          console.error('Error removing member:', error);
        }
      );
    }
  }

  calculateProgress(): number {
    if (!this.teamData.tasks || this.teamData.tasks.length === 0) {
      return 0;
    }

    const totalTasks = this.teamData.tasks.length;
    const completedTasks = this.teamData.tasks.filter(
      (t: any) => t.status === 'Done'
    ).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }

  getStatusColor(status: string): string {
    return this.statusService.getStatusColor(status);
  }

  numberOfTasksWithIssues(): number {
    return this.teamData.tasks.filter((t: any) => t.needsHelp).length;
  }

  numberOfMembers(): number {
    return this.teamData.members.length;
  }

  numberOfTasks(): number {
    console.log('Number of tasks:', this.teamData.tasks);
    return this.teamData.tasks > 0 ? this.teamData.tasks.length : 0;
  }
}

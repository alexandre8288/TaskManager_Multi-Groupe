import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { StatusService } from '../../../core/services/status.service';

import { Team } from '../../../core/models/team.model';
import { TeamsService } from '../../../core/services/teams.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { TokenService } from '../../../core/services/token.service';
import { UserDataService } from '../../../shared/services/user-data.service';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public teamCode: FormGroup = new FormGroup({});
  public currentDate = new Date();
  public team: Team | undefined;
  public teams: any[] = [];

  public statuses = this.statusService.getAllStatuses();
  userInfo: any;
  user: any;

  userData: any;

  private errorMessages: ErrorMessages = {
    code: {
      required: 'Enter a valid code',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    public statusService: StatusService,
    private userService: UserService,
    private tokenService: TokenService,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.userInfo = this.tokenService.getUserInfo();
    console.log('User Info from token:', this.userInfo);

    if (!this.userInfo) {
      console.error('No user info found');
      return;
    }

    this.userDataService.user$.subscribe((user) => {
      this.user = user;
      console.log('Fetched User Data:', this.user);
    });

    this.userDataService.userTeams$.subscribe((teams) => {
      this.teams = teams;
      console.log('Fetched User Teams:', this.teams);
    });

    this.statuses = this.statusService.getAllStatuses();
    this.teamCode = this.fb.group({
      code: ['', Validators.required],
    });

    if (!this.team) {
      this.router.navigate(['/dashboard/home']);
      return;
    }
  }

  getControl(name: string) {
    return this.teamCode.get(name);
  }

  getErrorMessage(name: string): string[] {
    const controlErrors = this.teamCode.get(name)?.errors;
    const errorMessages: string[] = [];

    if (controlErrors) {
      Object.keys(controlErrors).forEach((errorKey) => {
        const errorMessage = this.errorMessages[name]?.[errorKey];
        if (errorMessage) {
          errorMessages.push(errorMessage);
        }
      });
    }

    return errorMessages;
  }

  joinTeam() {
    if (this.teamCode.valid) {
      const code = this.teamCode.get('code')?.value;

      if (this.user) {
        this.userService.addUserToTeamByCode(this.user.id, code).subscribe(
          () => {
            this.userService.getUserTeams(this.user.id).subscribe(
              (teams) => {
                this.user.teams = teams;
                this.userDataService.updateUserTeams(teams);
              },
              (error) => {
                console.error(
                  'Error fetching user teams after joining:',
                  error
                );
              }
            );
          },
          (error) => {
            console.error('Error joining team:', error);
          }
        );
      }
    } else {
      console.error('Invalid team code form');
    }
  }
  redirectToCreateTeam() {
    this.router.navigate(['/dashboard/create-team']);
  }

  viewTeam(team: Team) {
    this.router.navigate(['/dashboard/team', team.id], {
      state: { teamData: team },
    });
  }

  updateStatus(newStatus: string): void {
    console.log('New Status Selected:', newStatus); // Debugging line
    this.userService.updateUserStatus(this.user.id, newStatus).subscribe({
      next: () => {
        this.user.status = newStatus;
      },
      error: (error) => {
        console.error('Error updating status:', error);
      },
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TeamsService } from '../../../core/services/teams.service';
import { UserService } from '../../../core/services/user.service';
import { UserDataService } from '../../../shared/services/user-data.service';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-create-team',
  templateUrl: './create-team.component.html',
  styleUrl: './create-team.component.scss',
})
export class CreateTeamComponent implements OnInit {
  public createTeamForm: FormGroup = new FormGroup({});
  public disabledButton: boolean = true;

  private errorMessages: ErrorMessages = {
    teamName: {
      required: 'Team name is required',
    },
    teamDescription: {
      required: 'Team description is required',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private teamsService: TeamsService,
    private userService: UserService,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.createTeamForm = this.fb.group({
      teamName: new FormControl('', [Validators.required]),
      teamDescription: new FormControl('', [Validators.required]),
    });

    this.createTeamForm.valueChanges.subscribe(() => {
      this.disabledButton = this.createTeamForm.invalid;
    });
  }

  setFormValue(name: string, value: any) {
    const control = this.createTeamForm.get(name);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      this.disabledButton = this.createTeamForm.invalid;
    }
  }

  async onSubmit() {
    if (this.createTeamForm.valid) {
      const teamName = this.createTeamForm.get('teamName')?.value;
      const teamDescription = this.createTeamForm.get('teamDescription')?.value;

      try {
        const teamDetails = {
          name: teamName,
          description: teamDescription,
        };

        const response = await this.teamsService
          .createTeam(teamDetails)
          .toPromise();

        console.log('Team successfully created:', response);

        // Navigate back to the home and force reload
        this.router.navigate(['/dashboard/home']).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Failed to create team', error);
      }
    }
  }

  getControl(name: string) {
    return this.createTeamForm.controls[name];
  }

  getErrorMessage(name: string): string[] {
    const controlErrors = this.createTeamForm.controls[name].errors;
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

  back() {
    this.router.navigate(['/dashboard/home']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDataService } from '../../shared/services/user-data.service';
import { UserService } from '../../core/services/user.service';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  public userForm: FormGroup = new FormGroup({});
  public currentUser: any = {};
  public editMode: boolean = false;
  public successMessage: boolean = false;

  private errorMessages: ErrorMessages = {
    teamName: {
      required: 'Team name is required',
    },
    teamDescription: {
      required: 'Team description is required',
    },
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private userDataService: UserDataService,
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
    });
  }

  ngOnInit(): void {
    // Fetch the current user data from the service
    this.userDataService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      console.log('Current User:', this.currentUser);

      // Set the form values with the current user data
      this.userForm.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUserData = this.userForm.value;

      if (updatedUserData.password !== updatedUserData.confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

      const userId = this.currentUser.id;

      this.userService
        .updateUser(userId, {
          firstname: updatedUserData.firstname,
          lastname: updatedUserData.lastname,
          email: updatedUserData.email,
          password: updatedUserData.password
            ? updatedUserData.password
            : undefined, // Send password only if it's updated
        })
        .subscribe(
          (response) => {
            console.log('User updated successfully', response);
            this.successMessage = true;
          },
          (error) => {
            console.error('Error updating user data:', error);
          }
        );
    } else {
      console.error('Form is not valid');
    }
  }

  getErrorMessage(name: string): string[] {
    const controlErrors = this.userForm.controls[name].errors;
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

  getControl(name: string) {
    return this.userForm.controls[name];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  back() {
    this.router.navigate(['/dashboard/home']);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }
}

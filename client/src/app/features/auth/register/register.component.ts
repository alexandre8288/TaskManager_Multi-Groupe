import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup = new FormGroup({});

  public iconEmail: string = 'assets/icons/icon-mail.svg';
  public iconPassword: string = 'assets/icons/icon-lock.svg';
  public iconUsername: string = 'assets/icons/icon-user.svg';

  public disabledButton: boolean = true;

  private errorMessages: ErrorMessages = {
    email: {
      required: 'Email is required',
      email: 'Please enter a valid email address',
    },
    password: {
      required: 'Password is required',
      minlength: 'Password must be at least 6 characters',
    },
    confirmationPassword: {
      required: 'Password confirmation is required',
      mustMatch: 'Passwords must match',
    },
    firstname: {
      required: 'First name is required',
    },
    lastname: {
      required: 'Last name is required',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.disabledButton = this.registerForm.invalid;
    });
  }

  getControl(name: string) {
    return this.registerForm.controls[name];
  }

  setFormValue(name: string, value: any) {
    const control = this.registerForm.get(name);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      this.disabledButton = this.registerForm.invalid;
    }
  }

  getErrorMessage(name: string): string[] {
    const controlErrors = this.registerForm.controls[name].errors;
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

  onSubmit() {
    if (this.registerForm.valid) {
      const userDetails = {
        firstname: this.registerForm.value.firstname,
        lastname: this.registerForm.value.lastname,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      // Pass the userDetails object to the createUser method
      this.userService.createUser(userDetails).subscribe(
        (response) => {
          console.log('User registered successfully:', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration error:', error);
          // Handle error accordingly, show error message to the user, etc.
        }
      );
      console.log('Form submitted:', this.registerForm.value);
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}

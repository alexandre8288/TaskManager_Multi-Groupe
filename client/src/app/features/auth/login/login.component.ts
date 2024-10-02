import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = new FormGroup({});
  public disabledButton: boolean = true;

  public iconEmail: string = 'assets/icons/icon-mail.svg';
  public iconPassword: string = 'assets/icons/icon-lock.svg';

  private errorMessages: ErrorMessages = {
    email: {
      required: 'Email is required',
      email: 'Please enter a valid email address',
    },
    password: {
      required: 'Password is required',
    },
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.disabledButton = this.loginForm.invalid;
    });
  }

  setFormValue(name: string, value: any) {
    const control = this.loginForm.get(name);
    if (control) {
      control.setValue(value);
      control.markAsTouched();
      this.disabledButton = this.loginForm.invalid;
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/dashboard/home']);
          } else {
            console.error('Login failed');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
        },
      });
    }
  }

  getControl(name: string) {
    return this.loginForm.controls[name];
  }

  getErrorMessage(name: string): string[] {
    const controlErrors = this.loginForm.controls[name].errors;
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
}

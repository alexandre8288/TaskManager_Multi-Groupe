import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-register',
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.scss',
})
export class ConfirmRegisterComponent implements OnInit {
  public otpForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      digit1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      digit4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
    });
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < 4) {
      const nextInput = document.querySelector(
        `input[formControlName='digit${index + 1}']`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onFocus(index: number): void {
    const input = document.querySelector(
      `input[formControlName='digit${index}']`
    ) as HTMLInputElement;
    input.select();
  }

  onSubmit(): void {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      console.log('OTP Submitted:', otp);
      this.router.navigate(['/register-success']);
    }
  }

  redirectToRegister() {
    this.router.navigate(['/login']);
  }
}

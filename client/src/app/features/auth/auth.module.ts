import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent } from '../../shared/components/select/select.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ConfirmRegisterComponent } from './confirm-register/confirm-register.component';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterSuccessComponent } from './register-success/register-success.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    OnboardingComponent,
    // InputComponent,
    // SelectComponent,
    ConfirmRegisterComponent,
    RegisterSuccessComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatSelectModule,
    MatInputModule,
    AuthRoutingModule,
  ],
})
export class AuthModule {}

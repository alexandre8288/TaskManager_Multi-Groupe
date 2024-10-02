import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
// import { NavbarComponent } from './shared/components/navbar/navbar.component';
// import { HighlightDirective } from './shared/directives/highlight.directive';
import { AuthModule } from './features/auth/auth.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { TeamsModule } from './features/teams/teams.module';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { NotificationsModule } from './features/notifications/notifications.module';
import { UsersStatusComponent } from './users-status/users-status.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './features/auth/auth-routing.module';
import { DashboardRoutingModule } from './features/dashboard/dashboard-routing.module';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [AppComponent, NotificationsComponent, UsersStatusComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    DashboardModule,
    TeamsModule,
    NotificationsModule,
    HttpClientModule,
    AuthRoutingModule,
    DashboardRoutingModule,
    FormsModule,
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

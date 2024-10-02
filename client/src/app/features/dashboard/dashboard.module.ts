import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskItemComponent } from './components/task-item/task-item.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CreateTeamComponent } from './create-team/create-team.component';
import { TasksComponent } from './tasks/tasks.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { SettingsComponent } from '../settings/settings.component';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskItemComponent,
    DashboardComponent,
    HomeComponent,
    CreateTeamComponent,
    TasksComponent,
    CreateTaskComponent,
    TaskDetailsComponent,
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class DashboardModule {}

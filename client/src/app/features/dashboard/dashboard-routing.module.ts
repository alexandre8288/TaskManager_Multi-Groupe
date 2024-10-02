import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { CreateTeamComponent } from './create-team/create-team.component';
import { TeamDetailComponent } from '../teams/team-detail/team-detail.component';
import { TasksComponent } from './tasks/tasks.component';
import { SettingsComponent } from '../settings/settings.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskDetailsComponent } from './task-details/task-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'create-team',
        component: CreateTeamComponent,
      },
      {
        path: 'team/:id',
        component: TeamDetailComponent,
      },
      {
        path: 'tasks',
        component: TasksComponent,
      },
      {
        path: 'task/:id',
        component: TaskDetailsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'create-task',
        component: CreateTaskComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}

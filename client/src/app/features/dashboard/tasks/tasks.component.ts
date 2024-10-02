import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StatusService } from '../../../core/services/status.service';

import { Team } from '../../../core/models/team.model';

import { TeamsService } from '../../../core/services/teams.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { UserDataService } from '../../../shared/services/user-data.service';
import { TasksService } from '../../../core/services/task.service';
import { get } from 'http';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  public statuses = this.statusService.getAllStatuses();
  public currentDate = new Date();
  public user: any = {};
  public tasks: any[] = [];

  constructor(
    private statusService: StatusService,
    private userService: UserService,
    private userDataService: UserDataService,
    private router: Router,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.userDataService.user$.subscribe((user) => {
      this.user = user || {};
    });

    this.userDataService.userTasks$.subscribe((tasks) => {
      this.user.tasks = tasks || [];
    });

    this.getUserTasks();
  }

  updateStatus(selectedStatusValue: string): void {
    const selectedStatus = this.statuses.find(
      (s) => s.value === selectedStatusValue
    );
    if (selectedStatus) {
      this.user.status = selectedStatus;
    }
  }

  toggleActiveTask(task: any): void {
    task.active = !task.active;
  }

  circleColorFromTask(task: any): string {
    return task.active ? '#006EE9' : '#FFFFFF';
  }

  topPriorityTasks() {
    return (
      this.user?.tasks?.filter((task: any) => task.isPriority === true) || []
    );
  }

  otherTasks() {
    return (
      this.user?.tasks?.filter((task: any) => task.isPriority === false) || []
    );
  }

  calculateDaysLeft(endDate: string): number {
    const today = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - today.getTime()) / (1000 * 3600 * 24));
  }

  viewTaskDetails(task: any): void {
    this.router.navigate(['/dashboard/task', task.id], {
      state: { taskData: task },
    });
    console.log('View task details:', task);
  }

  getTaskStatusColor(status: any): string {
    switch (status) {
      case 'To Do':
        return '#FFCC00';
      case 'In Progress':
        return '#006EE9';
      case 'Done':
        return '#00CC66';
      default:
        return '#FFFFFF';
    }
  }

  redirectToCreateTask() {
    this.router.navigate(['/dashboard/create-task']);
  }

  removeTask(task: any) {
    this.tasksService.deleteTask(task.id).subscribe(
      (response) => {
        console.log('Task removed successfully', response);
        this.userDataService.reloadUserTasks();
      },
      (error) => {
        console.error('Error removing task:', error);
      }
    );
  }

  getUserTasks() {
    this.tasksService.getTasksByUser(this.user.id).subscribe(
      (tasks) => {
        console.log('User tasks:', tasks);
        this.userDataService.updateUserTasks(tasks);
      },
      (error) => {
        console.error('Error fetching user tasks:', error);
      }
    );
  }
}

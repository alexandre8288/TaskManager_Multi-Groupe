import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserDataService } from '../../../shared/services/user-data.service';
import { Team } from '../../../core/models/team.model';
import { TasksService } from '../../../core/services/task.service';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
})
export class CreateTaskComponent implements OnInit {
  addTaskForm: FormGroup = new FormGroup({});
  teams: { value: string; label: string }[] = [];
  public disabledButton: boolean = true;
  isSubmitting = false;

  private errorMessages: ErrorMessages = {
    title: {
      required: 'Task title is required',
    },
    description: {
      required: 'Task description is required',
    },
    teamId: {
      required: 'Team is required',
    },
    estimatedTime: {
      required: 'Estimated time is required',
    },
    isPriority: {
      required: 'Priority is required',
    },
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.addTaskForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      teamId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      estimatedTime: new FormControl('', [Validators.required]),
      isPriority: new FormControl('', [Validators.required]),
      startDate: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      endDate: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
    });

    this.addTaskForm.valueChanges.subscribe(() => {
      this.disabledButton = this.addTaskForm.invalid;
    });

    this.userDataService.userTeams$.subscribe(
      (teams: Team[]) => {
        this.teams = teams.map((team) => ({
          value: team.id.toString(),
          label: team.name,
        }));
        console.log('Fetched User Teams:', this.teams);
      },
      (error) => {
        console.error('Failed to fetch teams:', error);
      }
    );
  }

  getControl(name: string) {
    return this.addTaskForm.controls[name];
  }

  getErrorMessage(name: string): string[] {
    const controlErrors = this.addTaskForm.controls[name].errors;
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

  setPriority(isPriority: boolean) {
    this.addTaskForm.get('isPriority')?.setValue(isPriority);
  }

  onSubmit() {
    if (this.isSubmitting) {
      console.log('Submission is already in progress');
      return; // Prevent further submissions while one is in progress
    }

    console.log('onSubmit called'); // Log when onSubmit is triggered
    this.isSubmitting = true; // Set flag to true at the start

    if (this.addTaskForm.valid) {
      const title = this.addTaskForm.get('title')?.value;
      const teamId = this.addTaskForm.get('teamId')?.value;
      const description = this.addTaskForm.get('description')?.value;
      const estimatedTime = this.addTaskForm.get('estimatedTime')?.value;
      const isPriority = this.addTaskForm.get('isPriority')?.value;
      const startDate = this.addTaskForm.get('startDate')?.value || null;
      const endDate = this.addTaskForm.get('endDate')?.value || null;
      const status = 'To Do';
      const userId = this.userDataService.getCurrentUserId(); // Get current user ID

      console.log('Task Details:', {
        title,
        teamId,
        description,
        estimatedTime,
        isPriority,
        status,
        userId,
        startDate,
        endDate,
      });

      if (userId) {
        const totalTime = 0; // Set a default value or calculate based on your logic

        const taskDetails = {
          title,
          teamId,
          description,
          estimatedTime,
          totalTime, // Include totalTime here
          isPriority,
          status,
          userId,
          startDate,
          endDate,
        };

        this.tasksService.createTask(taskDetails).subscribe(
          (response) => {
            console.log('Task created successfully:', response);
            // Fetch the updated tasks list
            this.tasksService.getTasksByUser(userId).subscribe(
              (tasks) => {
                this.userDataService.updateUserTasks(tasks);
                this.router.navigate(['/dashboard/tasks']);
                this.isSubmitting = false; // Reset flag after successful submission
              },
              (error) => {
                console.error('Failed to fetch updated tasks:', error);
                this.isSubmitting = false; // Reset flag after failure
              }
            );
          },
          (error) => {
            console.error('Failed to create task:', error);
            this.isSubmitting = false; // Reset flag after failure
          }
        );
      } else {
        console.error('No user ID available for task creation');
        this.isSubmitting = false; // Reset flag if no user ID
      }
    } else {
      console.error('Form is invalid');
      this.isSubmitting = false; // Reset flag if form is invalid
    }
  }

  back() {
    this.router.navigate(['/dashboard/tasks']);
  }
}

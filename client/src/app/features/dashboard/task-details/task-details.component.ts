import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '../../../core/services/task.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserDataService } from '../../../shared/services/user-data.service';
import { Team } from '../../../core/models/team.model';

type ErrorMessages = {
  [key: string]: { [key: string]: string };
};

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TaskDetailsComponent {
  public taskData: any = {};
  public taskId: number | null = null;
  public isEditMode: boolean = false;

  public monthsSince: number | null = null;
  public daysSince: number | null = null;
  public hoursSince: number | null = null;

  public helpRequested: boolean = false;

  public editTaskForm: FormGroup = new FormGroup({});
  public teams: { value: string; label: string }[] = [];
  public disabledButton: boolean = true;
  public statusOptions: { value: string; label: string }[] = [
    { value: 'To Do', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Done', label: 'Done' },
  ];

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
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['taskData']) {
      this.taskData = nav.extras.state['taskData'];
      this.calculateTimeSinceStart();
      this.populateForm();
    } else {
      this.route.params.subscribe((params) => {
        this.taskId = +params['id'];
        if (this.taskId) {
          this.fetchTaskData(this.taskId);
        }
      });
    }

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

    this.editTaskForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      teamId: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      estimatedTime: new FormControl('', [Validators.required]),
      isPriority: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
    });

    this.editTaskForm.valueChanges.subscribe(() => {
      this.disabledButton = this.editTaskForm.invalid;
    });
  }

  fetchTaskData(taskId: number): void {
    this.tasksService.getTaskById(taskId).subscribe(
      (task) => {
        this.taskData = task;
        console.log('Fetched Task:', this.taskData);
        this.calculateTimeSinceStart();
        this.cd.detectChanges();
      },
      (error) => console.error('Error fetching task data:', error)
    );
  }

  calculateTimeSinceStart(): void {
    if (this.taskData.startDate) {
      const startDate = new Date(this.taskData.startDate);
      const currentDate = new Date();

      // Calculate the time difference in milliseconds
      const diffTime = currentDate.getTime() - startDate.getTime();

      // Ensure no negative time difference
      if (diffTime < 0) {
        console.warn(
          'Start date is in the future. Cannot calculate time differences.'
        );
        this.monthsSince = 0;
        this.daysSince = 0;
        this.hoursSince = 0;
        return;
      }

      // Calculate the difference in days and hours
      this.daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      this.hoursSince = Math.floor(
        (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      this.monthsSince = this.calculateMonthsDifference(startDate, currentDate);

      console.log('Months Since:', this.monthsSince);
      console.log('Days Since:', this.daysSince);
      console.log('Hours Since:', this.hoursSince);
    }
  }

  populateForm(): void {
    this.editTaskForm.patchValue({
      title: this.taskData.title || '',
      teamId: this.taskData.teamId || '',
      description: this.taskData.description || '',
      estimatedTime: this.taskData.estimatedTime || '',
      isPriority: this.taskData.isPriority || false,
      status: this.taskData.status || 'To Do',
    });
  }

  calculateTimeDifference(startDate: Date, endDate: Date): number {
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60); // Convert to hours
    return Math.floor(differenceInHours); // Return an integer (rounded down)
  }

  calculateMonthsDifference(startDate: Date, currentDate: Date): number {
    let months =
      (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
      (currentDate.getMonth() - startDate.getMonth());
    if (currentDate.getDate() < startDate.getDate()) {
      months--;
    }
    return Math.max(months, 0); // Ensure monthsSince is not negative
  }

  calculateDaysDifference(startDate: Date, currentDate: Date): number {
    // Calculate the time difference in milliseconds
    const diffTime = currentDate.getTime() - startDate.getTime();
    // Calculate days difference
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0); // Ensure daysSince is not negative
  }

  calculateHoursDifference(startDate: Date, currentDate: Date): number {
    // Calculate the time difference in milliseconds
    const diffTime = currentDate.getTime() - startDate.getTime();
    // Calculate hours difference
    const diffHours = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    return Math.max(diffHours, 0); // Ensure hoursSince is not negative
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.populateForm();
    }
  }

  getControl(name: string) {
    return this.editTaskForm.controls[name];
  }

  onStatusChange(selectedStatus: string): void {
    this.editTaskForm.get('status')?.setValue(selectedStatus);
  }

  getErrorMessage(name: string): string[] {
    const controlErrors = this.editTaskForm.controls[name].errors;
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
    this.editTaskForm.get('isPriority')?.setValue(isPriority);
  }

  onSubmit(): void {
    if (this.editTaskForm.valid && this.taskId !== null) {
      const title = this.editTaskForm.get('title')?.value;
      const description = this.editTaskForm.get('description')?.value;
      const estimatedTime = this.editTaskForm.get('estimatedTime')?.value;
      const isPriority = this.editTaskForm.get('isPriority')?.value;
      const status = this.editTaskForm.get('status')?.value || 'To Do'; // Default status if not set

      const taskDetails: any = {
        title,
        description,
        estimatedTime,
        isPriority,
        status,
      };

      // Set startDate if status is 'In Progress'
      if (status === 'In Progress' && !this.taskData.startDate) {
        taskDetails.startDate = new Date().toISOString();
      }

      // Set endDate and calculate totalTime if status is 'Done'
      if (status === 'Done' && !this.taskData.endDate) {
        const endDate = new Date(); // Declare endDate here
        taskDetails.endDate = this.formatDateForMySQL(endDate);

        // If startDate exists, calculate totalTime
        if (this.taskData.startDate) {
          const startDate = new Date(this.taskData.startDate);
          const totalTime = this.calculateTimeDifference(startDate, endDate);
          taskDetails.totalTime = totalTime; // Add totalTime to taskDetails
        }
      }

      // Call the service to update the task
      this.tasksService.updateTask(this.taskId, taskDetails).subscribe(
        (response) => {
          console.log('Task updated successfully:', response);
          this.isEditMode = false;
          this.fetchTaskData(this.taskId as number); // Reload the task data
        },
        (error) => {
          console.error('Error updating task:', error);
        }
      );
    } else {
      console.error('Task ID is null or form is invalid.');
    }
  }

  formatDateForMySQL(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  askForHelp(): void {
    if (this.taskId) {
      this.tasksService.updateTask(this.taskId, { needsHelp: true }).subscribe(
        (response) => {
          console.log('Task updated with help request:', response);
          this.taskData.needsHelp = true; // Update local data
          this.cd.detectChanges(); // Trigger change detection
          this.helpRequested = true;
        },
        (error) => {
          console.error('Error updating task with help request:', error);
          // Handle error case
        }
      );
    }
  }
}

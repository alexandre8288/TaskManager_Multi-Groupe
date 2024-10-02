import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { StatusService, Status } from '../../../core/services/status.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent implements OnInit {
  @Input() user: any; // Adjust the type if necessary
  @Output() statusUpdated = new EventEmitter<string>();
  statuses$: Observable<Status[]> = of([]);

  constructor(
    private statusService: StatusService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.statuses$ = of(this.statusService.getAllStatuses() || []);
  }

  getStatusColor(status: string): string {
    return this.statusService.getStatusColor(status);
  }

  updateStatus(status: string): void {
    if (this.user) {
      this.userService.updateUserStatus(this.user.id, status).subscribe(() => {
        this.user.status = status;
      });
    }
  }
}

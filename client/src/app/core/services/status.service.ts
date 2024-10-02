import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Status {
  value: string;
  label: string;
  hexColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private statuses: Status[] = [
    { value: 'available', label: 'Available', hexColor: '#05E900' },
    { value: 'notBusy', label: 'Not Busy', hexColor: '#F1E701' },
    { value: 'busy', label: 'Busy', hexColor: '#E97E00' },
    { value: 'na', label: 'N/A', hexColor: '#CD2C2C' },
  ];

  constructor() {}

  getStatusColor(status: string): string {
    const statusObj = this.statuses.find((s) => s.value === status);
    return statusObj ? statusObj.hexColor : '#grey';
  }

  getAllStatuses(): Status[] {
    return this.statuses;
  }
}

import { TestBed } from '@angular/core/testing';

import { HistoryAlertsService } from './history-alert.service';

describe('HistoryAlertsService', () => {
  let service: HistoryAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAlertsService } from './history-alerts.service';

describe('HistoryAlertsService', () => {
  let service: HistoryAlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoryAlertsService],
    }).compile();

    service = module.get<HistoryAlertsService>(HistoryAlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

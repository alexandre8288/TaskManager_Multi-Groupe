import { Test, TestingModule } from '@nestjs/testing';
import { HistoryAlertsController } from './history-alerts.controller';

describe('HistoryAlertsController', () => {
  let controller: HistoryAlertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryAlertsController],
    }).compile();

    controller = module.get<HistoryAlertsController>(HistoryAlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

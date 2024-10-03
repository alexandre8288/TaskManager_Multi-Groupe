import { Test, TestingModule } from '@nestjs/testing';
import { UserTeamController } from './user-team.controller';

describe('UserTeamController', () => {
  let controller: UserTeamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTeamController],
    }).compile();

    controller = module.get<UserTeamController>(UserTeamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './teams.entity';
import { UserTeam } from '../user-team/user-team.entity';
import { AuthModule } from '../auth/auth.module';
import { Task } from 'src/tasks/tasks.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team, UserTeam, Task]),
    forwardRef(() => AuthModule),
  ],
  providers: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule {}

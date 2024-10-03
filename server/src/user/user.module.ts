import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserTeam } from '../user-team/user-team.entity';
import { Task } from '../tasks/tasks.entity';
import { Team } from '../teams/teams.entity'; 
import { TeamsModule } from '../teams/teams.module'; 
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserTeam, Task, Team]),
    TeamsModule,
    forwardRef(() => AuthModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}

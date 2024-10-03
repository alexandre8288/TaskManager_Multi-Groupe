import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTeamService } from './user-team.service';
import { UserTeam } from './user-team.entity';
import { User } from '../user/user.entity'; 
import { Team } from '../teams/teams.entity'; 
import { UserTeamController } from './user-team.controller'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([UserTeam, User, Team]),
  ],
  providers: [UserTeamService],
  controllers: [UserTeamController],
})
export class UserTeamModule {}

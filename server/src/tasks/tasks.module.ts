import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './tasks.entity';
import { Comment } from '../comments/comments.entity';
import { User } from '../user/user.entity';
import { Team } from '../teams/teams.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Comment, User, Team])],
  providers: [TasksService],
  controllers: [TasksController],
})
export class TasksModule {}
/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Controller('tasks')
@UseGuards(AuthGuard('jwt')) // Protéger toutes les routes du contrôleur avec JWT
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(
    @Body() details: Partial<Task>,
    @Body('userId') userId: number,
    @Body('teamId') teamId: number,
  ) {
    return this.tasksService.createTask(details, userId, teamId);
  }

  @Put(':id')
  updateTask(@Param('id') id: number, @Body() details: Partial<Task>) {
    return this.tasksService.updateTask(id, details);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: number) {
    return this.tasksService.deleteTask(id);
  }

  @Put(':id/assign')
  assignTaskToUser(
    @Param('id') taskId: number,
    @Body('userId') userId: number,
  ) {
    return this.tasksService.assignTaskToUser(taskId, userId);
  }

  @Put(':id/status')
  updateTaskStatus(
    @Param('id') taskId: number,
    @Body('status') status: 'To Do' | 'In Progress' | 'Done',
  ) {
    return this.tasksService.updateTaskStatus(taskId, status);
  }

  @Get(':id/log-time')
  logTime(@Param('id') taskId: number, @Body('timeSpent') timeSpent: number) {
    return this.tasksService.logTime(taskId, timeSpent);
  }

  @Get('user/:userId')
  findTasksByUser(@Param('userId') userId: number) {
    return this.tasksService.findTasksByUser(userId);
  }

  @Get('available')
  findAvailableTasks() {
    return this.tasksService.findAvailableTasks();
  }

  @Get('team/:teamId')
  findTasksByTeam(@Param('teamId') teamId: number) {
    return this.tasksService.findTasksByTeam(teamId);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') taskId: number,
    @Body('userId') userId: number,
    @Body('text') text: string,
  ) {
    return this.tasksService.addComment(taskId, userId, text);
  }

  @Get(':id')
  findTaskById(@Param('id') id: number) {
    return this.tasksService.findTaskById(id);
  }

  @Get('alert/help')
  findTaskNeedHelp() {
    return this.tasksService.findTaskNeedHelp();
  }




}

/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Put,
  UseGuards,
  ForbiddenException,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @Roles('Admin')
  async createTeam(
    @Request() req: any, // Inject request object to access the user details
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    try {
      // Create the team and automatically associate the creating user
      return await this.teamsService.createTeam(
        name,
        description,
        req.user.userId,
      );
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ForbiddenException(error.message);
      }
      throw error;
    }
  }

  @Put(':id')
  @Roles('Admin')
  async updateTeam(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('description') description: string,
  ) {
    try {
      return await this.teamsService.updateTeam(id, name, description);
    } catch (error) {
      throw new ForbiddenException(
        'You do not have permission to update this team.',
      );
    }
  }

  @Delete(':id')
  @Roles('Admin')
  async deleteTeam(@Param('id') id: number) {
    try {
      return await this.teamsService.deleteTeam(id);
    } catch (error) {
      throw new ForbiddenException(
        'You do not have permission to delete this team.',
      );
    }
  }

  @Post(':id/users')
  associateUserToTeam(
    @Param('id') teamId: number,
    @Body('userId') userId: number,
  ) {
    return this.teamsService.associateUserToTeam(userId, teamId);
  }

  @Get(':id/users')
  findTeamMembers(@Param('id') teamId: number) {
    return this.teamsService.findTeamMembers(teamId);
  }

  @Get()
  findAllTeams() {
    return this.teamsService.findAllTeams();
  }

  @Get('check-code/:code')
  async checkCode(@Param('code') code: string): Promise<boolean> {
    return this.teamsService.checkCodeExists(code);
  }

  @Get(':id/tasks')
  async findTasksByTeam(@Param('id') teamId: number) {
    return this.teamsService.findTasksByTeam(teamId);
  }

  @Get(':id')
  findTeamById(@Param('id') id: number) {
    return this.teamsService.findTeamById(id);
  }

  @Delete(':teamId/users/:userId')
  async removeUserFromTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.teamsService.removeUserFromTeam(userId, teamId);
  }
}

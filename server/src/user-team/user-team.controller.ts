import { Controller, Post, Delete, Param, Body, Get, UseGuards } from '@nestjs/common';
import { UserTeamService } from './user-team.service'; 
import { AuthGuard } from '@nestjs/passport';

@Controller('user-team')
@UseGuards(AuthGuard('jwt'))  // Protéger toutes les routes avec JWT
export class UserTeamController {
  constructor(private readonly userTeamService: UserTeamService) {}

  // Associer un utilisateur à une équipe
  @Post()
  associateUserToTeam(
    @Body('userId') userId: number,
    @Body('teamId') teamId: number,
  ) {
    return this.userTeamService.associateUserToTeam(userId, teamId);
  }

  // Supprimer l'utilisateur d'une équipe
  @Delete(':userId/:teamId')
  removeUserFromTeam(
    @Param('userId') userId: number,
    @Param('teamId') teamId: number,
  ) {
    return this.userTeamService.removeUserFromTeam(userId, teamId);
  }

  // Obtenir toutes les équipes d'un utilisateur
  @Get('user/:userId')
  findTeamsByUser(@Param('userId') userId: number) {
    return this.userTeamService.findTeamsByUser(userId);
  }

  // Obtenir tous les utilisateurs d'une équipe
  @Get('team/:teamId')
  findUsersByTeam(@Param('teamId') teamId: number) {
    return this.userTeamService.findUsersByTeam(teamId);
  }
}

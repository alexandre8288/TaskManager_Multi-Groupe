/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTeam } from './user-team.entity';
import { User } from '../user/user.entity';
import { Team } from '../teams/teams.entity';

@Injectable()
export class UserTeamService {
  constructor(
    @InjectRepository(UserTeam)
    private userTeamRepository: Repository<UserTeam>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  // Associer un utilisateur à une équipe
  async associateUserToTeam(userId: number, teamId: number): Promise<UserTeam> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const team = await this.teamRepository.findOne({ where: { id: teamId } });

    const userTeam = this.userTeamRepository.create({ user, team });
    return this.userTeamRepository.save(userTeam);
  }

  // Supprimer un utilisateur d'une équipe
  async removeUserFromTeam(userId: number, teamId: number): Promise<void> {
    await this.userTeamRepository.delete({
      user: { id: userId },
      team: { id: teamId },
    });
  }

  // Obtenir toutes les équipes d'un utilisateur
  async findTeamsByUser(userId: number): Promise<Team[]> {
    const userTeams = await this.userTeamRepository.find({
      where: { user: { id: userId } },
      relations: ['team'],
    });
    return userTeams.map((ut) => ut.team);
  }

  // Obtenir tous les utilisateurs d'une équipe
  async findUsersByTeam(teamId: number): Promise<User[]> {
    const userTeams = await this.userTeamRepository.find({
      where: { team: { id: teamId } },
      relations: ['user'],
    });
    return userTeams.map((ut) => ut.user);
  }
}

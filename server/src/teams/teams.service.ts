/* eslint-disable prettier/prettier */
// src/teams/teams.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './teams.entity';
import { UserTeam } from '../user-team/user-team.entity';
import { Task } from '../tasks/tasks.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,
    @InjectRepository(UserTeam)
    private userTeamRepository: Repository<UserTeam>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTeam(
    name: string,
    description: string,
    userId: number,
  ): Promise<Team> {
    const existingTeam = await this.teamsRepository.findOne({
      where: { name },
    });
    if (existingTeam) {
      throw new ForbiddenException('A team with this name already exists.');
    }

    const code = this.generateUniqueCode();
    const newTeam = this.teamsRepository.create({ name, description, code });
    const savedTeam = await this.teamsRepository.save(newTeam);

    // Automatically associate the creating user with the newly created team
    await this.associateUserToTeam(userId, savedTeam.id);

    return savedTeam;
  }

  private generateUniqueCode(): string {
    // Implémentation basique d'un générateur de code aléatoire
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async updateTeam(
    id: number,
    name: string,
    description: string,
  ): Promise<Team> {
    await this.teamsRepository.update(id, { name, description });
    return this.teamsRepository.findOneBy({ id });
  }

  async deleteTeam(id: number): Promise<void> {
    await this.teamsRepository.delete(id);
  }

  async associateUserToTeam(userId: number, teamId: number): Promise<UserTeam> {
    const userTeam = this.userTeamRepository.create({
      user: { id: userId },
      team: { id: teamId },
    });
    return this.userTeamRepository.save(userTeam);
  }

  async findTeamMembers(teamId: number): Promise<UserTeam[]> {
    return this.userTeamRepository.find({
      where: { team: { id: teamId } },
      relations: ['user'],
    });
  }

  async findAllTeams(): Promise<Team[]> {
    return this.teamsRepository.find({ relations: ['userTeams'] });
  }

  async checkCodeExists(code: string): Promise<boolean> {
    const team = await this.teamsRepository.findOne({ where: { code } });
    return !!team; // Returns true if a team with the code exists, false otherwise
  }

  async findTasksByTeam(teamId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { team: { id: teamId } },
      relations: ['user', 'team'], // Assuming tasks have relations to user and team
    });
  }

  async findTeamById(id: number): Promise<Team> {
    return this.teamsRepository.findOne({ where: { id } });
  }

  async removeUserFromTeam(userId: number, teamId: number): Promise<void> {
    const result = await this.userTeamRepository.delete({
      user: { id: userId },
      team: { id: teamId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('User or Team not found');
    }
  }
}

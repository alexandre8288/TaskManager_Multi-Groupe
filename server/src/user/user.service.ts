/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Team } from '../teams/teams.entity';
import { Task } from '../tasks/tasks.entity';
import { UserTeam } from '../user-team/user-team.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,

    @InjectRepository(UserTeam)
    private readonly userTeamRepository: Repository<UserTeam>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // Trouver un utilisateur par son ID
  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOneBy({ id });
  }

  // Trouver un utilisateur par son email (ou nom d'utilisateur)
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  // Méthode pour récupérer les équipes liées à un utilisateur
  async findTeamsByUserId(userId: number): Promise<Team[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userTeams', 'userTeams.team'], // Charger la relation avec les équipes
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Renvoyer les équipes liées à l'utilisateur via la table UserTeam
    return user.userTeams.map((userTeam) => userTeam.team);
  }

  // Récupérer les tâches liées à un utilisateur
  async findTasksByUserId(userId: number): Promise<Task[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.taskRepository.find({ where: { user: { id: userId } } });
  }

  // Récupérer tous les utilisateurs avec leur nom, prénom et statut
  async findAllWithStatus(): Promise<
    { firstname: string; lastname: string; status: string }[]
  > {
    return this.userRepository.find({
      select: ['firstname', 'lastname', 'status'],
    });
  }

  // Ajouter un nouvel utilisateur
  async createUser(userDetails: Partial<User>): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDetails.password, saltRounds);

    const role = userDetails.role || 'Member'; // Définir un rôle par défaut si non spécifié

    const user = this.userRepository.create({
      ...userDetails,
      role, // Ajouter le rôle ici
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // Mettre à jour un utilisateur existant
  async updateUser(id: number, updateDetails: Partial<User>): Promise<User> {
    // Si un nouveau mot de passe est fourni, hachez-le avant de mettre à jour
    if (updateDetails.password) {
      const saltRounds = 10; // Le coût de traitement pour bcrypt
      updateDetails.password = await bcrypt.hash(updateDetails.password, saltRounds);
    }
  
    // Mettez à jour l'utilisateur avec les nouveaux détails, y compris le mot de passe haché si fourni
    await this.userRepository.update(id, updateDetails);
  
    // Retourner l'utilisateur mis à jour
    return this.findOneById(id);
  }

  // Supprimer un utilisateur
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // Ajouter un utilisateur à une équipe via un code d'équipe
  async addUserToTeamByCode(userId: number, teamCode: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const team = await this.teamRepository.findOne({
      where: { code: teamCode },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!team) {
      throw new NotFoundException(`Team with code ${teamCode} not found`);
    }
    // Vérifier si l'utilisateur est déjà dans l'équipe
    const userTeamExists = await this.userTeamRepository.findOne({
      where: { user: { id: userId }, team: { id: team.id } },
    });

    if (userTeamExists) {
      throw new Error('User is already part of this team');
    }
    const userTeam = this.userTeamRepository.create({
      user,
      team,
    });
    await this.userTeamRepository.save(userTeam);
  }

  // Retirer un utilisateur d'une équipe
  async removeUserFromTeam(userId: number, teamId: number): Promise<void> {
    const userTeam = await this.userTeamRepository.findOne({
      where: { user: { id: userId }, team: { id: teamId } },
    });

    if (!userTeam) {
      throw new NotFoundException('User is not part of the team');
    }

    await this.userTeamRepository.delete(userTeam.id);
  }

  async updateStatus(id: number, status: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    user.status = status;
    return this.userRepository.save(user);
  }
}

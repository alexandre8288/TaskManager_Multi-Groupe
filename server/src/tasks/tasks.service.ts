/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './tasks.entity';
import { Comment } from '../comments/comments.entity';
import { User } from '../user/user.entity';
import { Team } from 'src/teams/teams.entity';
import { from, Observable } from 'rxjs';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  async createTask(
    details: Partial<Task>,
    userId: number,
    teamId: number,
  ): Promise<Task> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const team = await this.teamRepository.findOneBy({ id: teamId });
  
    if (!user || !team) {
      throw new Error('User or team not found'); // Gestion des erreurs pour user ou team inexistants
    }
  
    const task = this.tasksRepository.create({
      ...details,
      user: user,
      team: team,
      startDate: details.status === 'In Progress' ? new Date() : undefined, // Initialiser la startDate seulement si la tâche est immédiatement mise en progression
    });
    return this.tasksRepository.save(task);
  }  

  async updateTask(id: number, details: Partial<Task>): Promise<Task> {
    // Chercher la tâche actuelle pour comparer le statut
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
        throw new Error('Task not found');
    }
    // Vérifier si le statut est valide et modifié avant de l'appliquer
    const validStatuses: Task['status'][] = ['To Do', 'In Progress', 'Done'];
    if (details.status && details.status !== task.status && validStatuses.includes(details.status)) {
        return this.updateTaskStatus(id, details.status as 'To Do' | 'In Progress' | 'Done');
    }
    // Mettre à jour la tâche sans toucher à totalTime ou endDate pour les autres changements
    await this.tasksRepository.update(id, details);
    return this.tasksRepository.findOneBy({ id });
}

  async deleteTask(id: number): Promise<void> {
    await this.tasksRepository.delete(id);
  }

  async assignTaskToUser(taskId: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id: taskId });
    task.user = { id: userId } as User;
    return this.tasksRepository.save(task);
  }

  async updateTaskStatus(
    taskId: number,
    status: 'To Do' | 'In Progress' | 'Done',
  ): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id: taskId });
    if (!task) {
      throw new Error('Task not found');
    }
    task.status = status;
  
    // S'assurer que startDate est un objet Date avant de l'utiliser
    const startDate = task.startDate ? new Date(task.startDate) : null;
  
    if (status === 'In Progress' && !startDate) {
      task.startDate = new Date(); // Définir startDate si la tâche passe à In Progress
    }
  
    if (status === 'Done' && startDate) {
      task.endDate = new Date(); // Définir endDate lorsque la tâche est marquée comme terminée
      const endDate = new Date(task.endDate);
      task.totalTime = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
      ); // Calculer totalTime en jours
    }
  
    return this.tasksRepository.save(task);
  }
  
  

  async logTime(taskId: number, timeSpent: number): Promise<{task: Task, message: string}> {
    const task = await this.tasksRepository.findOneBy({ id: taskId });

    if (!task.startDate) {
        // Renvoie un message si la startDate n'est pas définie
        return { task, message: "Cannot log time because the task has not started yet." };
    }

    // Ajoutez le temps passé à totalTime
    task.totalTime += timeSpent;

    // Si la tâche n'est pas marquée comme terminée (pas de endDate), calculez la durée depuis la startDate
    if (!task.endDate) {
        const now = new Date();
        const startDate = new Date(task.startDate);
        const timeSinceStart = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        task.totalTime = timeSinceStart;
    }

    await this.tasksRepository.save(task);
    return { task, message: "Time logged successfully." };
  }

  async findTasksByUser(userId: number): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user: { id: userId } } });
  }

  async findAvailableTasks(): Promise<Task[]> {
    return this.tasksRepository.find({ where: { user: null } });
  }

  async findTasksByTeam(teamId: number): Promise<Task[]> {
    return this.tasksRepository.find({ where: { team: { id: teamId } } });
  }

  async addComment(
    taskId: number,
    userId: number,
    text: string,
  ): Promise<Comment> {
    const comment = this.commentsRepository.create({
      task: { id: taskId },
      user: { id: userId },
      text,
    });
    return this.commentsRepository.save(comment);
  }

  // Récupérer une tâche par son ID
  async findTaskById(id: number): Promise<Task> {
    return this.tasksRepository.findOneBy({ id });
  }

  async findTaskNeedHelp(): Promise<Task[]> {
    return this.tasksRepository.find({ where: { needsHelp: true }, relations: ['user', 'team'] });
  }
}

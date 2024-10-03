// src/teams/user-team.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Team } from '../teams/teams.entity';

@Entity('User_team')
export class UserTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.userTeams)
  user: User;

  @ManyToOne(() => Team, team => team.userTeams)
  team: Team;
}

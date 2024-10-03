import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  Request,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('status')
  findAllWithStatus() {
    return this.userService.findAllWithStatus();
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin', 'Member')
  async updateUser(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
    @Request() req,
  ): Promise<User> {
    console.log('Request user:', req.user); // Log pour vérifier les détails de l'utilisateur
  
    const currentUser = req.user;
    if (!currentUser) {
      console.error('No user object in request');
      throw new UnauthorizedException('User not authenticated');
    }
  
    // Vérifier si l'utilisateur actuel essaie de modifier un autre utilisateur
    if (currentUser.id !== +id && currentUser.role !== 'Admin') {
      console.error(`Unauthorized attempt by user ${currentUser.id} to update user ${id}`);
      throw new UnauthorizedException("You can only modify your own profile unless you're an Admin.");
    }
  
    // Si l'utilisateur n'est pas un Admin, interdire la modification du rôle
    if (currentUser.role !== 'Admin' && updateData.role) {
      console.error(`Unauthorized role modification attempt by user ${currentUser.id}`);
      throw new UnauthorizedException("Only an Admin can modify the user's role.");
    }
  
    // Assurez-vous que l'objet de mise à jour contient des données avant de procéder
    if (Object.keys(updateData).length === 0) {
      console.error('Update data is empty');
      throw new BadRequestException('Update data cannot be empty');
    }
  
    // Si tout est OK, mettre à jour l'utilisateur
    console.log(`Updating user ${id} by user ${currentUser.id}`);
    const updatedUser = await this.userService.updateUser(+id, updateData);
    
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    return updatedUser;
  }


  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Utiliser JWT pour l'authentification
  @Roles('Admin')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.userService.deleteUser(+id);
  }

  @Put(':id/join-team')
  @UseGuards(AuthGuard('jwt')) // Protéger avec JWT
  async addUserToTeamByCode(
    @Param('id') id: number,
    @Body('teamCode') teamCode: string, // Le code d'équipe est passé dans le body
  ): Promise<void> {
    return this.userService.addUserToTeamByCode(+id, teamCode);
  }

  @Get(':id')
  async findOneById(@Param('id') id: number) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get(':id/teams')
  @UseGuards(AuthGuard('jwt')) // Protéger avec JWT
  async findTeamsByUserId(@Param('id') id: number) {
    return this.userService.findTeamsByUserId(+id);
  }

  @Get(':id/tasks')
  @UseGuards(AuthGuard('jwt')) // Protéger avec JWT
  async findTasksByUserId(@Param('id') id: number) {
    return this.userService.findTasksByUserId(+id);
  }

  @Delete(':id/team/:teamId')
  @UseGuards(AuthGuard('jwt'), RolesGuard) // Utiliser JWT pour l'authentification
  @Roles('Admin')
  async removeUserFromTeam(
    @Param('id') id: number,
    @Param('teamId') teamId: number,
  ): Promise<void> {
    return this.userService.removeUserFromTeam(+id, +teamId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ): Promise<void> {
    await this.userService.updateStatus(id, status);
  }
}

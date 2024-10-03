import { Controller, Get } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('status')
  findAllWithStatus() {
    return this.userService.findAllWithStatus();
  }
}

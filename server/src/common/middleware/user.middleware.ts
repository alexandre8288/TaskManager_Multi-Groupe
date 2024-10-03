import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Simulate a logged-in user with role
    // req.user = { id: 1, role: 'Admin' }; // Change role to 'User' to test non-admin access
    next();
  }
}

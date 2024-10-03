// src/auth/session.serializer.ts
import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  deserializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }
}

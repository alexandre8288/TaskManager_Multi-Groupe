import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // Utilisez la même clé secrète que celle dans le module JWT
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role }; // Assurez-vous de retourner le rôle
  }
}

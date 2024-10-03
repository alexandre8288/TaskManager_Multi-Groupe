import { Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'; // Guard pour protéger les routes via JWT
import { LocalAuthGuard } from './local-auth.guard'; // Guard pour la connexion via la stratégie locale

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard) // Utilisation de la stratégie locale pour le login
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user); // Générer et renvoyer le token JWT
  }

  @UseGuards(JwtAuthGuard) // Protection des routes avec JWT
  @Get('logout')
  async logout(@Request() req) {
    // For JWT, the server doesn't need to handle logout since it's stateless.
    // Simply confirm the request and handle token removal on the client side.
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard) // Protection des routes avec JWT
  @Get('status')
  getStatus(@Request() req) {
    return req.user; // Renvoie les informations de l'utilisateur connecté
  }
}

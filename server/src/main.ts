import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for specific origins
  app.enableCors({
    origin: 'http://localhost:4200', // Angular frontend origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.use(passport.initialize());  // Initialise Passport pour l'authentification via JWT

  await app.listen(3002);
}
bootstrap();

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TeamsModule } from './teams/teams.module';
import { UserTeamModule } from './user-team/user-team.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { AlertsModule } from './alerts/alerts.module';
import { HistoryAlertsModule } from './history-alerts/history-alerts.module';
import { AuthModule } from './auth/auth.module';

require('dotenv').config({ path: '../.env' });
// console.log(process.env.DB_HOST);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Rendre les variables d'environnement globales
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      // port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UserModule,
    TeamsModule,
    UserTeamModule,
    TasksModule,
    CommentsModule,
    AlertsModule,
    HistoryAlertsModule,
    forwardRef(() => AuthModule),
  ],
})
export class AppModule {}

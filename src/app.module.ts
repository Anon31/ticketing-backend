import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        // 1. Charge les variables d'environnement (.env) pour toute l'application
        ConfigModule.forRoot({ isGlobal: true }),

        // 2. Connecte MongoDB de manière asynchrone (attend la lecture du .env)
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI'),
            }),
        }),

        // 3. Vos modules métiers générés par le CLI
        IncidentsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

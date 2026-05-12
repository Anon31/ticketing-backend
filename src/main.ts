import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const globalPrefix = 'api/v1';
    app.setGlobalPrefix(globalPrefix); // Versioning de l'API
    app.enableCors();
    // Utilisation du port dynamique (idéal pour le déploiement Cloud)
    const port = process.env.PORT || 3000;
    await app.listen(port);
    // Message d'alerte propre dans la console
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`, 'Bootstrap');
}
bootstrap();

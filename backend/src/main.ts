import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  // Création de l'application avec le module principal
  const app = await NestFactory.create(AppModule);

  // Configuration du logger pour une meilleure observabilité
  app.useLogger(app.get(Logger));

  // Activation de la validation automatique pour sécuriser les DTO en filtrant les propriétés non souhaitées
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Activation du parsing des cookies pour gérer l'authentification et la gestion de session
  app.use(cookieParser());

  // Configuration du port à partir des variables d'environnement pour une flexibilité entre environnements
  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();

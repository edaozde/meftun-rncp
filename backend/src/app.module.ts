console.log(' ProductsController a bien été mis à jour !');

import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CheckoutModule } from './checkout/checkout.module';
import { PinoLogger } from 'nestjs-pino';
import { AdminModule } from './admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module'; // ✅ Ajout du PrismaModule
import { AuditLoggerMiddleware } from './middleware/audit-logger.middleware'; // ✅ Ajout du middleware

@Module({
  imports: [
    PrismaModule, // ✅ Ajoute PrismaModule pour rendre PrismaService disponible
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: false,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname',
                  },
                },
            level: isProduction ? 'info' : 'debug',
          },
        };
      },
      inject: [ConfigService],
    }),

    // ✅ Configuration pour servir les images stockées dans "public"
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),

    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    ProductsModule,
    CheckoutModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly logger: PinoLogger) {
    this.logger.info('🚀 Application NestJS démarrée avec succès !');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditLoggerMiddleware).forRoutes('*'); // ✅ Middleware actif sur toutes les routes
  }
}

import {
  Injectable,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from './dto/create.user.request';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserRequest) {
    this.logger.log(
      `Tentative de création de l'utilisateur avec l'email : ${data.email}`,
    );

    try {
      this.logger.debug(`Début du hash du mot de passe pour ${data.email}`);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      this.logger.debug(`Mot de passe hashé avec succès pour ${data.email}`);

      const newUser = await this.prismaService.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: {
          email: true,
          id: true,
        },
      });

      this.logger.log(
        ` Utilisateur créé avec succès : ${newUser.email} (ID: ${newUser.id})`,
      );

      return newUser;
    } catch (err) {
      if (err.code === 'P2002') {
        this.logger.warn(
          `⚠ Échec de la création : l'email ${data.email} existe déjà.`,
        );
        throw new UnprocessableEntityException('Email already exists.');
      }
      this.logger.error(
        ` Erreur lors de la création de l'utilisateur : ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    this.logger.log(
      `🔍 Recherche de l'utilisateur avec le filtre : ${JSON.stringify(filter)}`,
    );

    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: filter,
      });

      this.logger.debug(
        `✅ Utilisateur trouvé : ${JSON.stringify(user, null, 2)}`,
      );

      return user;
    } catch (err) {
      this.logger.warn(
        `⚠ Aucun utilisateur trouvé pour le filtre : ${JSON.stringify(filter)}`,
      );
      throw err;
    }
  }
}

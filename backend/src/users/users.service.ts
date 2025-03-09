import {
  Injectable,
  UnprocessableEntityException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from './dto/create.user.request';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * ✅ Création d'un nouvel utilisateur avec validation RGPD
   */
  async createUser(data: CreateUserRequest) {
    this.logger.log(
      `📌 Tentative de création d'un utilisateur avec l'email : ${data.email}`,
    );

    // ✅ Vérification RGPD : Empêcher la création de compte si le consentement n'est pas donné
    if (!data.acceptedPrivacyPolicy) {
      this.logger.warn(
        `⚠ Échec de la création : l'utilisateur ${data.email} n'a pas accepté la politique de confidentialité.`,
      );
      throw new BadRequestException(
        'Vous devez accepter la politique de confidentialité pour créer un compte.',
      );
    }

    try {
      this.logger.debug(`🔐 Hashage du mot de passe pour ${data.email}`);
      const hashedPassword = await bcrypt.hash(data.password, 10);
      this.logger.debug(`✅ Mot de passe hashé avec succès pour ${data.email}`);

      const newUser = await this.prismaService.user.create({
        data: {
          ...data,
          password: hashedPassword, // 🔒 Stocke le mot de passe sécurisé
          role: 'USER', // ✅ Définir le rôle par défaut
        },
        select: {
          id: true,
          email: true,
          password: true, // ✅ Nécessaire pour le login
          role: true, // ✅ Nécessaire pour le login
          acceptedPrivacyPolicy: true,
        },
      });

      this.logger.log(
        `✅ Utilisateur créé avec succès : ${newUser.email} (ID: ${newUser.id})`,
      );

      return newUser;
    } catch (err) {
      if (err.code === 'P2002') {
        this.logger.warn(
          `⚠ Échec de la création : l'email ${data.email} existe déjà.`,
        );
        throw new UnprocessableEntityException('Cet email est déjà utilisé.');
      }

      this.logger.error(
        `❌ Erreur lors de la création de l'utilisateur : ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  /**
   * ✅ Récupération d'un utilisateur via un filtre (email ou ID)
   */
  async getUser(filter: Prisma.UserWhereUniqueInput) {
    this.logger.log(
      `🔍 Recherche d'un utilisateur avec le filtre : ${JSON.stringify(filter)}`,
    );

    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: filter,
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          acceptedPrivacyPolicy: true,
          createdAt: true,
        },
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

  /**
   * ✅ Suppression d'un utilisateur (Droit à l'Oubli - RGPD)
   */
  async deleteUser(userId: number) {
    this.logger.log(`🗑 Suppression de l'utilisateur ID: ${userId}`);

    try {
      await this.prismaService.user.delete({
        where: { id: userId },
      });

      this.logger.log(`✅ Utilisateur ID: ${userId} supprimé avec succès.`);
      return { message: 'Compte supprimé avec succès.' };
    } catch (err) {
      this.logger.error(
        `❌ Erreur lors de la suppression de l'utilisateur ID: ${userId}`,
        err.stack,
      );
      throw new UnprocessableEntityException(
        'Erreur lors de la suppression du compte.',
      );
    }
  }
}

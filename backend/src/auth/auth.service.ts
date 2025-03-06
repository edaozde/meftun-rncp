import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token.payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const secretKey =
      user.role === 'ADMIN' || user.role === 'SUPERADMIN'
        ? this.configService.getOrThrow<string>('JWT_SECRET_ADMIN')
        : this.configService.getOrThrow<string>('JWT_SECRET_USER');

    const expiresIn =
      user.role === 'ADMIN' || user.role === 'SUPERADMIN'
        ? this.configService.getOrThrow<string>('JWT_EXPIRATION_ADMIN')
        : this.configService.getOrThrow<string>('JWT_EXPIRATION');

    const tokenPayload: TokenPayload = {
      userId: user.id,
      role: user.role,
    };

    const token = this.jwtService.sign(tokenPayload, {
      secret: secretKey,
      expiresIn,
    });

    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: expiresIn.includes('h')
        ? parseInt(expiresIn) * 3600000
        : parseInt(expiresIn) * 1000,
    });

    return { message: 'Connexion réussie', tokenPayload };
  }

  // ✅ Ajout de la méthode adminLogin
  async adminLogin(email: string, password: string, response: Response) {
    const user = await this.usersService.getUser({ email });

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
      throw new UnauthorizedException("Accès refusé, vous n'êtes pas admin.");
    }

    const authenticated = await bcrypt.compare(password, user.password);
    if (!authenticated) {
      throw new UnauthorizedException('Mot de passe incorrect.');
    }

    console.log('✅ Admin authentifié, envoi de la réponse...'); // 🔥 Ajout du log

    return this.login(user, response); // Vérifie bien que cette ligne est exécutée
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Identifiants incorrects.');
    }
  }
}

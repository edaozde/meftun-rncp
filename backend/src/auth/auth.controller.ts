import { Controller, Post, Res, UseGuards, Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';
import { AdminGuard } from './guards/admin-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  // ✅ Correction de admin/login avec authentification + vérification admin
  @UseGuards(LocalAuthGuard, AdminGuard) // 🔥 Ajout des deux guards
  @Post('admin/login')
  async adminLogin(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('📥 Admin authentifié :', user);

    return this.authService.login(user, res); // ✅ Envoi bien le cookie JWT
  }
}

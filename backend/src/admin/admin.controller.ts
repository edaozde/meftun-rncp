import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard) // ✅ Sécurisation automatique de toutes les routes Admin
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const totalProducts = await this.prisma.product.count();
    const totalVariants = await this.prisma.variant.count();
    return { totalProducts, totalVariants };
  }

  //  Nouvelle route pour récupérer les logs d’audit
  @Get('logs')
  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      include: {
        user: {
          select: { email: true }, //  On récupère juste l'email de l'admin
        },
        product: {
          select: { name: true }, //  On récupère juste le nom du produit concerné
        },
      },
      orderBy: { createdAt: 'desc' }, //  On trie par ordre chronologique
    });
  }
}

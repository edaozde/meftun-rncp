import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard) // ✅ On remet les guards pour tester
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    console.log('📌 Route /admin/stats appelée !');
    const totalProducts = await this.prisma.product.count();
    const totalVariants = await this.prisma.variant.count();
    return { totalProducts, totalVariants };
  }
}

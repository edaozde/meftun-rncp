import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  async getStats() {
    const totalProducts = await this.prisma.product.count();
    const totalVariants = await this.prisma.variant.count();
    return { totalProducts, totalVariants };
  }
}

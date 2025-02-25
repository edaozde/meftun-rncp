import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  providers: [PrismaService],
})
export class AdminModule {}

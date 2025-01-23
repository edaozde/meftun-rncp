// rental.module.ts

import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RentalController } from './rental.controller';
import { RentalService } from './rental.service';

@Module({
  imports: [PrismaModule],
  controllers: [RentalController],
  providers: [RentalService],
})
export class RentalModule {}

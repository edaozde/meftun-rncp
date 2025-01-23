import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalService {
  constructor(private readonly prisma: PrismaService) {}

  async createRental(createRentalDto: CreateRentalDto) {
    const { startDate, endDate, productId, userId } = createRentalDto;

    // Calculer le prix total en fonction des jours
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new Error('Produit introuvable');

    const days =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 3600 * 24);
    const totalPrice = days * (product.pricePerDay || 0);

    return this.prisma.rental.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'pending',
        totalPrice,
        userId,
        productId,
      },
    });
  }

  async getAllRentals() {
    return this.prisma.rental.findMany({
      include: { product: true, user: true },
    });
  }

  async getRentalById(id: number) {
    return this.prisma.rental.findUnique({
      where: { id },
      include: { product: true, user: true },
    });
  }

  async updateRental(id: number, updateRentalDto: UpdateRentalDto) {
    return this.prisma.rental.update({ where: { id }, data: updateRentalDto });
  }
}

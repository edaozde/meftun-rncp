import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  async addToCart(userId: number, productId: number, variantId: number) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      create: { user: { connect: { id: userId } } },
      update: {},
    });

    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId_variantId: {
          cartId: cart.id,
          productId,
          variantId,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        variantId,
        quantity: 1,
      },
      update: {
        quantity: { increment: 1 },
      },
    });
  }
}

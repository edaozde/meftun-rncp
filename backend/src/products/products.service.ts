import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    try {
      // Conversion des variants si nécessaire
      const variants =
        typeof data.variants === 'string'
          ? JSON.parse(data.variants)
          : data.variants;

      // Validation basique
      if (!Array.isArray(variants)) {
        throw new Error('Les variants doivent être un tableau');
      }

      return await this.prismaService.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          user: { connect: { id: userId } },
          variants: {
            create: variants.map((variant) => ({
              size: variant.size,
              color: variant.color,
              stock: variant.stock,
            })),
          },
        },
        include: { variants: true },
      });
    } catch (error) {
      throw new Error(`Erreur création produit : ${error.message}`);
    }
  }

  async getProducts() {
    return this.prismaService.product.findMany({
      include: { variants: true },
    });
  }

  async getProduct(productId: number) {
    try {
      return await this.prismaService.product.findUniqueOrThrow({
        where: { id: productId },
        include: { variants: true },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new NotFoundException(`Product not found with ID ${productId}`);
    }
  }
}

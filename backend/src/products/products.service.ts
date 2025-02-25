import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  // Méthode pour créer un produit
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

  // Méthode pour récupérer tous les produits
  async getProducts() {
    return this.prismaService.product.findMany({
      include: { variants: true },
    });
  }

  // Méthode pour récupérer un produit par son ID
  async getProduct(productId: number) {
    try {
      return await this.prismaService.product.findUniqueOrThrow({
        where: { id: productId },
        include: { variants: true },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new NotFoundException(`Produit non trouvé avec l'ID ${productId}`);
    }
  }
  async update(productId: number, data: Prisma.ProductUpdateInput) {
    return this.prismaService.product.update({
      where: { id: productId },
      data,
      include: { variants: true },
    });
  }

  // Méthode pour supprimer un produit
  async deleteProduct(productId: number, userId: number): Promise<boolean> {
    // Vérifier si le produit existe
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: { variants: true }, // Inclure les variantes associées
    });

    if (!product) {
      throw new BadRequestException('Produit non trouvé');
    }

    // Vérifier si l'utilisateur est bien le propriétaire du produit
    if (product.userId !== userId) {
      throw new BadRequestException(
        "Vous n'êtes pas autorisé à supprimer ce produit",
      );
    }

    // Supprimer les variantes associées au produit avant de supprimer le produit
    await this.prismaService.variant.deleteMany({
      where: { productId: productId },
    });

    // Suppression du produit
    await this.prismaService.product.delete({
      where: { id: productId },
    });

    return true; // Retourne true si la suppression a réussi
  }
}

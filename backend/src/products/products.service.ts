/* eslint-disable @typescript-eslint/no-unused-vars */
import { promises as fs } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { PRODUCT_IMAGES } from './product-image';

//commenter
@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    return this.prismaService.product.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
        variants: {
          create: data.variants?.map((variant) => ({
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
          })),
        },
        description: data.description,
        price: data.price,
      },
      include: { variants: true },
    });
  }

  async getProducts() {
    const products = await this.prismaService.product.findMany();
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    );
  }

  async getProduct(productId: number) {
    try {
      return {
        ...(await this.prismaService.product.findUniqueOrThrow({
          where: { id: productId },
        })),
        imageExists: await this.imageExists(productId),
      };
    } catch (err) {
      throw new NotFoundException(`Product not found with ID ${productId}`);
    }
  }

  // === NOUVELLES MÉTHODES POUR LES VARIANTES ===

  // Créer une variante pour un produit donné
  async addVariant(
    productId: number,
    size: string,
    color: string,
    stock: number,
  ) {
    return this.prismaService.variant.create({
      data: {
        productId,
        size,
        color,
        stock,
      },
    });
  }

  // Récupérer toutes les variantes d'un produit
  async getVariants(productId: number) {
    return this.prismaService.variant.findMany({
      where: { productId },
    });
  }

  // Récupérer une variante spécifique par son ID
  async getVariantById(variantId: number) {
    try {
      return await this.prismaService.variant.findUniqueOrThrow({
        where: { id: variantId },
      });
    } catch (err) {
      throw new NotFoundException(`Variant not found with ID ${variantId}`);
    }
  }

  // Mettre à jour une variante
  async updateVariant(
    variantId: number,
    data: Partial<{ size: string; color: string; stock: number }>,
  ) {
    return this.prismaService.variant.update({
      where: { id: variantId },
      data,
    });
  }

  // Supprimer une variante
  async deleteVariant(variantId: number) {
    return this.prismaService.variant.delete({
      where: { id: variantId },
    });
  }

  // Vérifier si une image existe pour un produit
  private async imageExists(productId: number) {
    try {
      await fs.access(
        join(`${PRODUCT_IMAGES}/${productId}.jpg`),
        fs.constants.F_OK,
      );
      return true;
    } catch (err) {
      return false;
    }
  }
}

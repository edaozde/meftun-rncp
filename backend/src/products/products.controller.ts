/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProductsService } from './products.service';
import { TokenPayload } from 'src/auth/token.payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Création d'un produit avec une image
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @CurrentUser() user: TokenPayload,
  ) {
    console.log('🔍 REQUÊTE REÇUE BACKEND:', body);
    console.log('🔍 Variants avant parsing:', body.variants);

    if (body.variants) {
      try {
        body.variants = JSON.parse(body.variants);
        console.log('✅ Variants après parsing:', body.variants);
      } catch (error) {
        console.error('🚨 Erreur de parsing des variants:', error);
        throw new BadRequestException('Variants must be a valid JSON array');
      }
    }

    // ✅ Conversion du prix en float pour éviter l'erreur Prisma
    body.price = parseFloat(body.price);
    if (isNaN(body.price)) {
      throw new BadRequestException('Price must be a valid number');
    }

    return this.productsService.createProduct(body, user.userId);
  }

  // Récupérer tous les produits
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts() {
    return this.productsService.getProducts();
  }

  // Récupérer un produit spécifique
  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(+productId);
  }

  // Supprimer un produit spécifique
  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: TokenPayload, // Récupère l'utilisateur connecté via le décorateur
  ) {
    // Appel du service pour supprimer le produit et ses variantes
    const result = await this.productsService.deleteProduct(
      +productId,
      user.userId,
    );

    if (!result) {
      throw new BadRequestException(
        "Produit non trouvé ou vous n'êtes pas autorisé à le supprimer",
      );
    }

    return { message: 'Produit supprimé avec succès' };
  }
}

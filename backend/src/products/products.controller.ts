/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProductsService } from './products.service';
import { TokenPayload } from 'src/auth/token.payload.interface';
import { UpdateProductRequest } from './dto/update-product.request';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {
    Logger.log('✅ ProductsController chargé', 'ProductsController');
  }

  // 🔥 TEST : Route `PUT` simple sans validation
  @Put('test-put')
  async testPut() {
    Logger.log(
      '✅ Route `PUT /products/test-put` détectée',
      'ProductsController',
    );
    return { message: 'PUT fonctionne !' };
  }

  // 🔥 TEST : Route `PUT` sans validation pour voir si ça bloque à cause de ValidationPipe
  @Put(':productId/no-validation')
  async updateProductNoValidation(@Param('productId') productId: string) {
    Logger.log(
      `✅ PUT reçu pour produit ${productId} (sans validation)`,
      'ProductsController',
    );
    return { message: `Produit ${productId} mis à jour (sans validation)` };
  }

  // 🔥 Route officielle `PUT /products/:id`
  @Put(':productId')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateData: UpdateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    Logger.log(
      `✅ Route PUT détectée pour produit ${productId}`,
      'ProductsController',
    );

    return this.productsService.updateProduct(
      +productId,
      updateData,
      user.userId,
    );
  }

  // Création d'un produit
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    Logger.log(
      '✅ Requête POST reçue pour création de produit',
      'ProductsController',
    );
    return this.productsService.createProduct(body, user.userId);
  }

  // Récupérer tous les produits
  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts() {
    Logger.log(
      '✅ Requête GET reçue pour tous les produits',
      'ProductsController',
    );
    return this.productsService.getProducts();
  }

  // Récupérer un produit spécifique
  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  async getProduct(@Param('productId') productId: string) {
    Logger.log(
      `✅ Requête GET reçue pour produit ${productId}`,
      'ProductsController',
    );
    return this.productsService.getProduct(+productId);
  }

  // Supprimer un produit spécifique
  @Delete(':productId')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    Logger.log(
      `🗑️ DELETE reçu pour produit ${productId}`,
      'ProductsController',
    );
    return this.productsService.deleteProduct(+productId, user.userId);
  }
}

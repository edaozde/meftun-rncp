import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin-auth.guard'; // ✅ Import du guard Admin
import { ProductsService } from './products.service';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token.payload.interface';
import { UpdateProductRequest } from './dto/update-product.request';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ Permet à tous les utilisateurs de voir les produits sans être connectés
  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(+productId);
  }

  // ✅ Seuls les ADMIN/SUPERADMIN peuvent créer des produits
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(body, user.userId);
  }

  // ✅ Seuls les ADMIN/SUPERADMIN peuvent modifier un produit
  @Put(':productId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateData: UpdateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.updateProduct(
      +productId,
      updateData,
      user.userId,
    );
  }

  // ✅ Seuls les ADMIN/SUPERADMIN peuvent supprimer un produit
  @Delete(':productId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.deleteProduct(+productId, user.userId);
  }
}

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from 'src/auth/token.payload.interface';
import { UpdateProductRequest } from './dto/update-product.request';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../config/upload.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(+productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(body, user.userId);
  }

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

  @Delete(':productId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.deleteProduct(+productId, user.userId);
  }

  // ✅ Upload d'image pour un produit
  @Post(':productId/image')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async uploadProductImage(
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.addProductImage(+productId, file.filename);
  }

  // ✅ Suppression d'image pour un produit
  @Delete(':productId/image/:imageId')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteProductImage(@Param('imageId') imageId: string) {
    return this.productsService.deleteProductImage(+imageId);
  }
}

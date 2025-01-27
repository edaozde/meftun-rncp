/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductRequest } from './dto/create-product.request';
import { CurrentUser } from '../auth/current-user.decorator';
import { ProductsService } from './products.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { TokenPayload } from 'src/auth/token.payload.interface';
import { PRODUCT_IMAGES } from './product-image';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(body, user.userId);
  }

  @Post(':productId/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: PRODUCT_IMAGES,
        filename: (req, file, callback) => {
          callback(
            null,
            `${req.params.productId}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    _file: Express.Multer.File,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  async getProduct(@Param('productId') productId: string) {
    return this.productsService.getProduct(+productId);
  }

  // === NOUVEAUX ENDPOINTS POUR LES VARIANTES ===

  // Créer une variante pour un produit
  @Post(':productId/variant')
  @UseGuards(JwtAuthGuard)
  async createVariant(
    @Param('productId') productId: string,
    @Body() body: { size: string; color: string; stock: number },
  ) {
    return this.productsService.addVariant(
      +productId,
      body.size,
      body.color,
      body.stock,
    );
  }

  // Récupérfer toutes les variantes d'un produit
  @Get(':productId/variants')
  @UseGuards(JwtAuthGuard)
  async getVariants(@Param('productId') productId: string) {
    return this.productsService.getVariants(+productId);
  }

  // Récupérer une variante spécifique
  @Get('variant/:variantId')
  @UseGuards(JwtAuthGuard)
  async getVariant(@Param('variantId') variantId: string) {
    return this.productsService.getVariantById(+variantId);
  }

  // Mettre à jour une variante
  @Patch('variant/:variantId')
  @UseGuards(JwtAuthGuard)
  async updateVariant(
    @Param('variantId') variantId: string,
    @Body() body: Partial<{ size: string; color: string; stock: number }>,
  ) {
    return this.productsService.updateVariant(+variantId, body);
  }

  
  // Supprimer une variante
  @Delete('variant/:variantId')
  @UseGuards(JwtAuthGuard)
  async deleteVariant(@Param('variantId') variantId: string) {
    return this.productsService.deleteVariant(+variantId);
  }
}

//commenter
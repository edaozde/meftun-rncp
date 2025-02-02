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
  BadRequestException,
  UsePipes,
  ValidationPipe,
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
  @UseInterceptors(FileInterceptor('image')) // Permet de traiter FormData correctement
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
}

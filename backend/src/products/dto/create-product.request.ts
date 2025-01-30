import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class VariantDto {
  @IsString({ message: 'Size must be a string' })
  @IsNotEmpty({ message: 'Size is required' })
  @Type(() => String)
  size: string;

  @IsString({ message: 'Color must be a string' })
  @IsNotEmpty({ message: 'Color is required' })
  @Type(() => String)
  color: string;

  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Type(() => Number)
  stock: number;
}

export class CreateProductRequest {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber({}, { message: 'Price must be a valid number' })
  @Type(() => Number)
  price: number;

  @IsArray({ message: 'Variants must be an array' })
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  @IsNotEmpty({ message: 'At least one variant is required' })
  variants: VariantDto[];
}

import {
  IsArray,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductRequest {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDto)
  variants: VariantDto[];
  description: any;
  price: any;
}

class VariantDto {
  @IsString()
  size: string;

  @IsString()
  color: string;

  @IsNumber()
  stock: number;
}

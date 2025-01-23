import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateRentalDto {
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

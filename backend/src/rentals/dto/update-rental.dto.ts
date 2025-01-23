import { IsOptional, IsString } from 'class-validator';

export class UpdateRentalDto {
  @IsString()
  @IsOptional()
  status?: string;
}

import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { CreateRentalDto } from './dto/create-rental.dto';
import { RentalService } from './rental.service';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  async createRental(@Body() createRentalDto: CreateRentalDto) {
    return this.rentalService.createRental(createRentalDto);
  }

  @Get()
  async getAllRentals() {
    return this.rentalService.getAllRentals();
  }

  @Get(':id')
  async getRentalById(@Param('id') id: number) {
    return this.rentalService.getRentalById(id);
  }

  @Put(':id')
  async updateRental(
    @Param('id') id: number,
    @Body() UpdateRentalDto: UpdateRentalDto,
  ) {
    return this.rentalService.updateRental(id, UpdateRentalDto);
  }
}

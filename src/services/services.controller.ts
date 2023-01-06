import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) { }
  @Get()
  async index(@Res() res: Response) {
    const services = await this.servicesService.findAll()
    return res.status(200).json(services)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createServiceDto: CreateServiceDto, @Res() res: Response) {
    await this.servicesService.create(createServiceDto)
    return res.status(201).send()
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id, @Res() res: Response) {
    await this.servicesService.delete(id)
    return res.status(204).send()
  }
}

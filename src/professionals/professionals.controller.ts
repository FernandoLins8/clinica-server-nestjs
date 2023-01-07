import { Body, Controller, Delete, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, Roles } from '../auth/decorators/roles.decorator';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalsService } from './professionals.service';

@Controller('professionals')
export class ProfessionalsController {
  constructor(private professionalsService: ProfessionalsService) { }

  @Get()
  async index(@Res() res: Response) {
    const professionals = await this.professionalsService.findAll()
    return res.json(professionals)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createProfessionalDto: CreateProfessionalDto, @Res() res: Response) {
    this.professionalsService.create(createProfessionalDto)
    return res.status(201).send()
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(@Param('id') id, @Res() res: Response) {
    await this.professionalsService.delete(id)
    return res.status(204).send()
  }

}

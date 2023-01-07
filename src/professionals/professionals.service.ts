import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.professional.findMany()
  }

  async create(data: CreateProfessionalDto) {
    return this.prisma.professional.create({
      data
    })
  }

  async delete(id: string) {
    await this.prisma.professional.delete({
      where: {
        id
      },
    });
  }
}

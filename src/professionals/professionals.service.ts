import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';

@Injectable()
export class ProfessionalsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    const professionals = await this.prisma.professional.findMany()
    const hostname = process.env.HOST;
    const port = process.env.PORT;

    return professionals.map(professional => {
      const imageUrl = professional.imagePath ? `http://${hostname}:${port}/${professional.imagePath}` : null
      delete professional.imagePath
      return {
        ...professional,
        imageUrl
      }
    })
  }

  async create(data: CreateProfessionalDto, imagePath: string | null) {
    return this.prisma.professional.create({
      data: {
        ...data,
        imagePath
      }
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

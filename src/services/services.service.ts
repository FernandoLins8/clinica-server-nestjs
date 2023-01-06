import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.service.findMany()
  }

  async create(data: CreateServiceDto) {
    const { name, value, durationInMinutes: duration } = data

    return await this.prisma.service.create({
      data: {
        name,
        value,
        duration,
      }
    })
  }

  async delete(id: string) {
    await this.prisma.service.delete({
      where: {
        id
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    const services = await this.prisma.service.findMany()

    const hostname = process.env.HOST;
    const port = process.env.PORT;

    return services.map(service => {
      const imageUrl = service.imagePath ? `http://${hostname}:${port}/${service.imagePath}` : null
      delete service.imagePath
      return {
        ...service,
        imageUrl
      }
    })
  }

  async create(data: CreateServiceDto, path: string | null) {
    const { name, value, durationInMinutes: duration } = data
    return await this.prisma.service.create({
      data: {
        name,
        value,
        duration,
        imagePath: path
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

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Role } from '../auth/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  async create(data: CreateClientDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (existingUser) {
      throw new Error('A user with the informed email already exists')
    }

    return await this.prisma.user.create({
      data: {
        ...data,
        role: Role.USER
      }
    })
  }
}

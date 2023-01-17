import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
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

  // Get basic user info (should not include password)
  async getUserInfoByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      },
      select: {
        name: true,
        role: true,
        email: true,
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

    const { email, name, password } = data
    const hashedPassword = await hash(password, 10);
    return await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: Role.USER
      }
    })
  }
}

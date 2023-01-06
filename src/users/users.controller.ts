import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateClientDto } from './dto/create-client.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() createClientDto: CreateClientDto, @Res() res: Response) {
    this.usersService.create(createClientDto)
    return res.status(201).send()
  }
}

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserInfo(@Req() req) {
    return this.usersService.getUserInfoByEmail(req.user.email)
  }
}

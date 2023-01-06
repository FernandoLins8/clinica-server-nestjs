import { Body, Controller, Post } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.usersService.create(createClientDto)
  }
}

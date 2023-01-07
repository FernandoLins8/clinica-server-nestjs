import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [AppointmentsService, PrismaService, UsersService],
  controllers: [AppointmentsController]
})
export class AppointmentsModule { }

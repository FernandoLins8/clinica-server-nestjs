import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { OwnedAppointment } from 'src/auth/guards/ownedAppointment.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService, private usersService: UsersService) { }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req) {
    const user = await this.usersService.findByEmail(req.user.email)
    return this.appointmentService.create(createAppointmentDto, user.id)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/start')
  async startAppointment(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findByEmail(req.user.email)
    return this.appointmentService.startAppointment(id, user.id)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post(':id/finish')
  async finishAppointment(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findByEmail(req.user.email)
    await this.appointmentService.finishAppointment(id, user.id)
    return await this.appointmentService.getAppointmentSummary(id)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async index() {
    return await this.appointmentService.findAll()
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('client')
  async getClientAppointments(@Req() req) {
    const user = await this.usersService.findByEmail(req.user.email)
    return this.appointmentService.findAllFromUser(user.id)
  }

  @UseGuards(JwtAuthGuard, OwnedAppointment)
  @Get(':id')
  async getAppointment(@Param('id') id: string) {
    return this.appointmentService.getAppointment(id)
  }
}

import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UsersService } from 'src/users/users.service';
import { AppointmentsService } from './appointments.service';
import { AddProfessionalDto } from './dto/add-professional.dto';
import { AddServiceDto } from './dto/add-service.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService, private usersService: UsersService) { }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto, @Req() req) {
    const user = await this.usersService.findByEmail(req.user.email)
    const appointment = await this.appointmentService.create(createAppointmentDto, user.id)
    return appointment
  }

  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('services')
  async addService(@Body() addServiceDto: AddServiceDto) {
    return this.appointmentService.addService(addServiceDto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('professional')
  async addProfessional(@Body() addProfessionalDto: AddProfessionalDto) {
    return this.appointmentService.addProfessional(addProfessionalDto)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('start')
  async startAppointment(@Body() addProfessionalDto: AddProfessionalDto, @Request() req) {
    const user = await this.usersService.findByEmail(req.user.email)
    return this.appointmentService.startAppointment(addProfessionalDto, user.id)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('finish')
  async finishAppointment(@Body() addProfessionalDto: AddProfessionalDto, @Request() req) {
    const user = await this.usersService.findByEmail(req.user.email)
    await this.appointmentService.finishAppointment(addProfessionalDto, user.id)
    return await this.appointmentService.getAppointmentSummary(addProfessionalDto.appointmentId, user.id)
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async index() {
    return await this.appointmentService.findAll()
  }
}

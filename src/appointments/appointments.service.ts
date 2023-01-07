import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddProfessionalDto } from './dto/add-professional.dto';
import { AddServiceDto } from './dto/add-service.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { StartAppointmentDto } from './dto/start-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.appointment.findMany()
  }

  async create(data: CreateAppointmentDto, clientId: string) {
    const appointment = await this.prisma.appointment.create({
      data: {
        clientId,
        professionalId: data.professionalId
      }
    })

    return appointment
  }

  async addService(addServiceDto: AddServiceDto) {
    const { appointmentId, serviceId } = addServiceDto
    return await this.prisma.appointmentService.create({
      data: {
        appointmentId,
        serviceId
      }
    })
  }

  async addProfessional(addProfessionalDto: AddProfessionalDto) {
    const { appointmentId, professionalId } = addProfessionalDto
    return await this.prisma.appointment.update({
      data: {
        professionalId
      },
      where: {
        id: appointmentId
      }
    })
  }

  async startAppointment(startAppointmentDto: StartAppointmentDto, attendeeId: string) {
    return this.prisma.appointment.update({
      data: {
        attendeeId,
        startTime: new Date()
      }, where: {
        id: startAppointmentDto.appointmentId
      }
    })
  }

  async finishAppointment(startAppointmentDto: StartAppointmentDto, attendeeId: string) {
    return await this.prisma.appointment.update({
      data: {
        attendeeId,
        endTime: new Date()
      }, where: {
        id: startAppointmentDto.appointmentId
      }
    })
  }

  async getAppointmentSummary(appointmentId: string, attendeeId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: appointmentId
      },
      include: {
        appointmentService: {
          include: {
            service: {
              select: {
                name: true,
                duration: true,
                value: true
              }
            }
          }
        },
        professional: {
          select: {
            commission: true
          }
        }
      }
    })

    let totalServicesDuration = 0
    let servicesCost = 0

    const parsedServices = appointment.appointmentService.map(appointment => {
      const { name, duration, value } = appointment.service

      totalServicesDuration += duration
      servicesCost += value

      return {
        name: name,
        duration: duration,
        value: value,
      }
    })

    const professionalCommission = servicesCost * appointment.professional.commission
    const appointmentDuration = Number((((
      appointment.endTime.getTime() - appointment.createdAt.getTime())
      / (60 * 10)) / 60).toFixed(2))

    return {
      servicesCost,
      professionalCommission,
      totalCost: servicesCost + professionalCommission,
      totalServicesDuration,
      appointmentDuration, // 60 seconds per minute, 1000 milliseconds per second
      services: {
        parsedServices
      }
    }
  }
}

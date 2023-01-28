import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentsService } from './appointments.service';

interface Appointment {
  id: string
  clientId: string
  professionalId: string
  attendeeId?: string
  startTime?: Date
  endTime?: Date

  appointmentService?: AppointmentService[],
  professional?: {
    commission: number
  }
}

interface AppointmentService {
  service: Service
}

interface Service {
  name: string,
  duration: number,
  value: number
}

const testAppointments: Appointment[] = [
  {
    id: "1",
    clientId: "client-id-1",
    attendeeId: null,
    professionalId: "141f49d6-02c8-4d68-b698-f5eca7fb95d6",
    startTime: null,
    endTime: null
  },
  {
    id: "2",
    clientId: "client-id-2",
    attendeeId: null,
    professionalId: "141f49d6-02c8-4d68-b698",
    startTime: null,
    endTime: null
  }
]

describe('AppointmentsService', () => {
  let appointmentService: AppointmentsService
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: PrismaService,
          useValue: {
            appointment: {
              findMany: jest.fn().mockResolvedValue(testAppointments),
              create: jest.fn().mockImplementation(({
                data: {
                  clientId,
                  professionalId,
                }
              }) => {
                const newAppointment = {
                  id: randomUUID(),
                  clientId,
                  professionalId,
                  attendeeId: null,
                  startTime: null,
                  endTime: null,
                }
                testAppointments.push(newAppointment)
                return newAppointment
              }),
              update: jest.fn().mockImplementation(({
                data, where
              }) => {
                const index = testAppointments.findIndex(appointment => appointment.id == where.id)
                testAppointments[index] = {
                  ...testAppointments[index],
                  ...data
                }
                return testAppointments[index]
              }),
              findUnique: jest.fn().mockImplementation((
                { where }
              ) => testAppointments.find(appointment => appointment.id == where.id))
            },
            appointmentService: {
              create: jest.fn()
            }
          }
        }
      ],
    }).compile();

    appointmentService = module.get<AppointmentsService>(AppointmentsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(appointmentService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all appointments', async () => {
      const appointments = await appointmentService.findAll()
      expect(appointments.length).toEqual(testAppointments.length)
    })
  })

  describe('create', () => {
    it('should create an appointment', async () => {
      const testProfessionalId = randomUUID()
      const testClientId = randomUUID()

      const newAppointment = await appointmentService.create({
        professionalId: testProfessionalId,
        servicesIds: ['fakeServiceId']
      }, testClientId)

      expect(testAppointments).toContain(newAppointment)
      expect(prismaService.appointment.create).toHaveBeenCalledWith({
        data: {
          clientId: testClientId,
          professionalId: testProfessionalId
        }
      })
    })
  })

  describe('startAppointment', () => {
    it('should add the appointment a start time', async () => {
      const attendeeId = randomUUID()
      const notStartedAppointment = {
        id: randomUUID(),
        clientId: "client-id-1",
        attendeeId: null,
        professionalId: "141f49d6-02c8-4d68-b698-f5eca7fb95d6",
        startTime: null,
        endTime: null
      }
      testAppointments.push(notStartedAppointment)
      expect(notStartedAppointment.startTime).toBe(null)

      const startedAppointment = await appointmentService.startAppointment(notStartedAppointment.id, attendeeId)
      expect(startedAppointment.startTime).not.toBe(null)
    })

    it('should add the attendee id to a started appointment', async () => {
      const attendeeId = randomUUID()
      const notStartedAppointment = {
        id: randomUUID(),
        clientId: "client-id-1",
        attendeeId: null,
        professionalId: "141f49d6-02c8-4d68-b698-f5eca7fb95d6",
        startTime: null,
        endTime: null
      }
      testAppointments.push(notStartedAppointment)

      const startedAppointment = await appointmentService.startAppointment(notStartedAppointment.id, attendeeId)
      expect(startedAppointment.attendeeId).toBe(attendeeId)
    })

    it('should not allow to restart an appointment', async () => {
      const attendeeId = randomUUID()
      const notStartedAppointment = {
        id: randomUUID(),
        clientId: "client-id-1",
        attendeeId: null,
        professionalId: "141f49d6-02c8-4d68-b698-f5eca7fb95d6",
        startTime: null,
        endTime: null
      }
      testAppointments.push(notStartedAppointment)

      const startedAppointment = await appointmentService.startAppointment(notStartedAppointment.id, attendeeId)
      expect(async () =>
        appointmentService.startAppointment(startedAppointment.id, attendeeId)
      ).rejects.toThrowError()
    })
  })

  describe('finishAppointment', () => {
    it('should add the appointment a finish time', async () => {
      const attendeeId = randomUUID()
      const notFinishedAppointment = {
        id: randomUUID(),
        clientId: "client-id-1",
        attendeeId: null,
        professionalId: "141f49d6-02c8-4d68-b698-f5eca7fb95d6",
        startTime: new Date(),
        endTime: null
      }
      testAppointments.push(notFinishedAppointment)
      expect(notFinishedAppointment.endTime).toBe(null)

      const startedAppointment = await appointmentService.finishAppointment(notFinishedAppointment.id, attendeeId)
      expect(startedAppointment.endTime).not.toBe(null)
    })

    it('should not be able to finish an appointment that did not start or has already ended', async () => {
      const attendeeId = randomUUID()
      const notStartedAppointment = {
        id: randomUUID(),
        clientId: "client-id-1",
        attendeeId: null,
        professionalId: "141f49d6-02c8-4d68-b698-f5eca7fb95d6",
        startTime: null,
        endTime: null
      }
      testAppointments.push(notStartedAppointment)

      expect(async () =>
        appointmentService.finishAppointment(notStartedAppointment.id, attendeeId)
      ).rejects.toThrowError()


      const startedAppointment = await appointmentService.startAppointment(notStartedAppointment.id, attendeeId)
      const finishedAppointment = await appointmentService.finishAppointment(startedAppointment.id, attendeeId)

      expect(async () =>
        appointmentService.finishAppointment(finishedAppointment.id, attendeeId)
      ).rejects.toThrowError()
    })

    it('should add the attendee id to a finished appointment', async () => {
      const attendeeId = randomUUID()
      const notFinishedAppointment = {
        id: randomUUID(),
        clientId: "client-id-1",
        attendeeId: null,
        professionalId: "141f49d6-02c8-4d68-b698-f5eca7fb95d6",
        startTime: new Date(),
        endTime: null
      }
      testAppointments.push(notFinishedAppointment)

      const startedAppointment = await appointmentService.finishAppointment(notFinishedAppointment.id, attendeeId)
      expect(startedAppointment.attendeeId).toBe(attendeeId)
    })
  })

  describe('getAppointmentSummary', () => {
    it('should return the correct summary for a given appointment id', async () => {
      const appointment = {
        id: randomUUID(),
        clientId: randomUUID(),
        professionalId: randomUUID(),
        appointmentService: [
          {
            service: {
              name: 'Haircut',
              duration: 30,
              value: 20
            },
          },
          {
            service: {
              name: 'Massage',
              duration: 60,
              value: 100
            },
          }
        ],
        professional: {
          commission: 0.1
        },
        endTime: new Date(),
        createdAt: new Date()
      }
      testAppointments.push(appointment)

      const summary = await appointmentService.getAppointmentSummary(appointment.id);

      expect(summary).toEqual({
        servicesCost: 120,
        professionalCommission: 12,
        totalCost: 132,
        expectedDurationInMinutes: 90,
        appointmentDurationInMinutes: expect.any(Number)
      });
    });
  })
});

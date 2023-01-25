import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServicesService } from './services.service';

const createServiceTestData: CreateServiceDto = {
  name: 'Test Service',
  value: 100,
  durationInMinutes: 60,
};

const testServices = [
  {
    id: '1',
    name: 'Test Service 1',
    value: 100,
    imageUrl: null,
    durationInMinutes: 60,
  },
  {
    id: '2',
    name: 'Test Service 2',
    value: 200,
    imageUrl: null,
    durationInMinutes: 120,
  },
];

describe('ServicesService', () => {
  let service: ServicesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              create: jest.fn().mockResolvedValue({
                ...createServiceTestData,
              }),
              findMany: jest.fn().mockResolvedValue(testServices),
              delete: jest.fn().mockImplementation((args) => {
                testServices.splice(
                  testServices.findIndex(service => service.id === args.where.id),
                  1,
                );
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of services', async () => {
      const result = await service.findAll();
      expect(result).toEqual(testServices);
      expect(prismaService.service.findMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const result = await service.create(createServiceTestData, 'imageFilename');
      expect(result).toEqual({
        ...createServiceTestData,
      });

      expect(prismaService.service.create).toHaveBeenCalledWith({
        data: {
          name: createServiceTestData.name,
          value: createServiceTestData.value,
          duration: createServiceTestData.durationInMinutes,
          imagePath: 'imageFilename'
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a service', async () => {
      const originalLength = testServices.length;

      await service.delete('1');

      expect(testServices.length).toEqual(originalLength - 1);
      expect(testServices.some(service => service.id === '1')).toBe(false);

      expect(prismaService.service.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });
});

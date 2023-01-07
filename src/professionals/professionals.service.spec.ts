import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessionalDto } from './dto/create-professional.dto';
import { ProfessionalsService } from './professionals.service';

const createServiceTestData: CreateProfessionalDto = {
  name: 'Test Service',
  commission: 100,
};

const testProfessionals = [
  {
    id: '1',
    name: 'Test Service 1',
    commission: 100,
  },
  {
    id: '2',
    name: 'Test Service 2',
    commission: 200,
  },
];

describe('ServicesService', () => {
  let service: ProfessionalsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionalsService,
        {
          provide: PrismaService,
          useValue: {
            professional: {
              create: jest.fn().mockResolvedValue({
                ...createServiceTestData,
              }),
              findMany: jest.fn().mockResolvedValue(testProfessionals),
              delete: jest.fn().mockImplementation((args) => {
                testProfessionals.splice(
                  testProfessionals.findIndex(service => service.id === args.where.id),
                  1,
                );
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProfessionalsService>(ProfessionalsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of professionals', async () => {
      const result = await service.findAll();
      expect(result).toEqual(testProfessionals);
      expect(prismaService.professional.findMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new professional', async () => {
      const result = await service.create(createServiceTestData);

      expect(result).toEqual({
        ...createServiceTestData,
      });

      expect(prismaService.professional.create).toHaveBeenCalledWith({
        data: {
          name: createServiceTestData.name,
          commission: createServiceTestData.commission,
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a professional', async () => {
      const originalLength = testProfessionals.length;

      await service.delete('1');

      expect(testProfessionals.length).toEqual(originalLength - 1);
      expect(testProfessionals.some(service => service.id === '1')).toBe(false);

      expect(prismaService.professional.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
        },
      });
    });
  });
});

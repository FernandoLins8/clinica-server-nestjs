import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UsersService } from './users.service';

const alreadyRegisteredEmail = 'test@test.com'
const testUser = {
  name: 'Test User',
  alreadyRegisteredEmail
}

const createTesteClientDto: CreateClientDto = {
  name: 'Test User',
  email: 'notRegisteredEmail@test.com',
  password: 'password',
};

describe('UsersService', () => {
  let userService: UsersService;
  let prismaService: PrismaService;;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique:
                jest.fn().mockImplementation((args) => {
                  if (args.where.email === alreadyRegisteredEmail) {
                    return Promise.resolve(testUser);
                  }
                  return Promise.resolve(undefined);
                }),
              create: jest.fn().mockResolvedValue({
                ...createTesteClientDto,
                role: 'user'
              })
            }
          }
        }
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return a user by email if one exists', async () => {
      const result = await userService.findByEmail(alreadyRegisteredEmail);
      expect(result).toEqual(testUser);
    });

    it('should return undefined if no user is found', async () => {
      const result = await userService.findByEmail('invalid@test.com');
      expect(result).toBeUndefined();
    })
  });

  describe('create', () => {
    it('should create a new user with a "user" role', async () => {
      const result = await userService.create(createTesteClientDto);

      expect(result).toEqual({
        ...createTesteClientDto,
        role: 'user',
      });

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createTesteClientDto,
          role: 'user',
        },
      });
    });

    it('should not create a user with an already existing email', async () => {
      expect(async () => {
        await userService.create({
          ...createTesteClientDto,
          email: alreadyRegisteredEmail
        });
      }).rejects.toThrow()
    })
  });
});

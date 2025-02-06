import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnprocessableEntityException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// On moque bcrypt pour éviter les problèmes de redéfinition de la méthode 'hash'
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  // On définit un objet mock pour PrismaService
  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('doit être défini', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const userData = {
      email: 'test@test.com',
      password: 'Test@1234',
      acceptedPrivacyPolicy: true,
    };

    it('doit créer un utilisateur avec un mot de passe hashé', async () => {
      const hashedPassword = 'hashed_password123';
      // On simule le hash du mot de passe
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      /*  
         Pour simuler le cas "utilisateur non existant", on fait en sorte que
         prismaService.user.findUniqueOrThrow rejette (par exemple, en renvoyant une erreur)
         afin que le code passe ensuite à la création de l’utilisateur.
      */
      mockPrisma.user.findUniqueOrThrow.mockRejectedValue(
        new Error('Not Found'),
      );

      // On simule la création de l'utilisateur
      const createdUser = {
        id: 1,
        email: userData.email,
        password: hashedPassword,
        role: Role.USER,
        acceptedPrivacyPolicy: true,
        createdAt: new Date(),
      };
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await service.createUser(userData);

      expect(result).toEqual({
        id: 1,
        email: userData.email,
        role: Role.USER,
        acceptedPrivacyPolicy: true,
        createdAt: expect.any(Date),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: hashedPassword,
          acceptedPrivacyPolicy: userData.acceptedPrivacyPolicy,
        },
        select: {
          id: true,
          email: true,
          role: true,
          acceptedPrivacyPolicy: true,
          createdAt: true,
        },
      });
    });

    it('doit renvoyer une erreur si l’email existe déjà', async () => {
      // Pour ce test, on simule que l'utilisateur existe déjà en renvoyant une valeur depuis findUniqueOrThrow.
      mockPrisma.user.findUniqueOrThrow.mockResolvedValue({
        id: 1,
        email: userData.email,
        password: 'some_hash',
        role: Role.USER,
        acceptedPrivacyPolicy: true,
        createdAt: new Date(),
      });
      await expect(service.createUser(userData)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    it('doit renvoyer une erreur si la politique de confidentialité n’est pas acceptée', async () => {
      const invalidUserData = { ...userData, acceptedPrivacyPolicy: false };

      // Ici, on s'attend à ce que le service vérifie la propriété acceptedPrivacyPolicy et lève une exception
      await expect(service.createUser(invalidUserData)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getUser', () => {
    it('doit retourner un utilisateur existant', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        password: 'hashed_password',
        role: Role.USER,
        acceptedPrivacyPolicy: true,
        createdAt: new Date(),
      };

      mockPrisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const result = await service.getUser({ email: 'test@test.com' });
      expect(result).toEqual(mockUser);
    });

    it('doit renvoyer une erreur si l’utilisateur n’existe pas', async () => {
      mockPrisma.user.findUniqueOrThrow.mockRejectedValue(
        new Error('Not Found'),
      );
      await expect(
        service.getUser({ email: 'inexistant@test.com' }),
      ).rejects.toThrow(Error);
    });
  });
});

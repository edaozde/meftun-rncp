import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    // Création du mock PrismaService
    const prismaServiceMock = {
      user: {
        create: jest.fn(),
        findUniqueOrThrow: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);

    // Reset tous les mocks avant chaque test
    jest.clearAllMocks();
  });

  /** ✅ Vérifie que le service est bien instancié */
  it('devrait être défini', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'Password123!',
      acceptedPrivacyPolicy: true,
    };

    const mockCreatedUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: Role.USER,
      acceptedPrivacyPolicy: true,
    };

    beforeEach(() => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    });

    it('should create a user successfully', async () => {
      // Arrange
      prismaService.user.create.mockResolvedValue(mockCreatedUser);

      // Act
      const result = await service.createUser(createUserDto);

      // Assert
      expect(result).toEqual(mockCreatedUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: 'hashedPassword',
          role: 'USER',
        },
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          acceptedPrivacyPolicy: true,
        },
      });
    });

    it('should throw BadRequestException if privacy policy not accepted', async () => {
      // Arrange
      const dtoWithoutPrivacyPolicy = {
        ...createUserDto,
        acceptedPrivacyPolicy: false,
      };

      // Act & Assert
      await expect(service.createUser(dtoWithoutPrivacyPolicy)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw UnprocessableEntityException if email already exists', async () => {
      // Arrange
      prismaService.user.create.mockRejectedValue({ code: 'P2002' });

      // Act & Assert
      await expect(service.createUser(createUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('getUser', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      role: Role.USER,
      acceptedPrivacyPolicy: true,
      createdAt: new Date(),
    };

    it('should find a user by email', async () => {
      // Arrange
      prismaService.user.findUniqueOrThrow.mockResolvedValue(mockUser);
      const filter = { email: 'test@example.com' };

      // Act
      const result = await service.getUser(filter);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: filter,
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          acceptedPrivacyPolicy: true,
          createdAt: true,
        },
      });
    });

    it('should find a user by id', async () => {
      // Arrange
      prismaService.user.findUniqueOrThrow.mockResolvedValue(mockUser);
      const filter = { id: 1 };

      // Act
      const result = await service.getUser(filter);

      // Assert
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: filter,
        select: {
          id: true,
          email: true,
          password: true,
          role: true,
          acceptedPrivacyPolicy: true,
          createdAt: true,
        },
      });
    });

    it('should throw an error if user not found', async () => {
      // Arrange
      prismaService.user.findUniqueOrThrow.mockRejectedValue(
        new Error('Not found'),
      );

      // Act & Assert
      await expect(
        service.getUser({ email: 'nonexistent@example.com' }),
      ).rejects.toThrow();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      prismaService.user.delete.mockResolvedValue({});

      // Act
      const result = await service.deleteUser(1);

      // Assert
      expect(result).toEqual({ message: 'Compte supprimé avec succès.' });
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw UnprocessableEntityException if deletion fails', async () => {
      // Arrange
      prismaService.user.delete.mockRejectedValue(new Error('Deletion failed'));

      // Act & Assert
      await expect(service.deleteUser(1)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });
});

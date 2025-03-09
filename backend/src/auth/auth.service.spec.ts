import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

// Mock bcrypt en entier plutôt que juste la méthode compare
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  // Mock de Response
  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    // Reset tous les mocks avant chaque test
    jest.clearAllMocks();

    // Création des mocks
    const usersServiceMock = {
      getUser: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mock.jwt.token'),
    };

    const configServiceMock = {
      getOrThrow: jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'JWT_SECRET_USER':
            return 'user-secret';
          case 'JWT_SECRET_ADMIN':
            return 'admin-secret';
          case 'JWT_EXPIRATION':
            return '1h';
          case 'JWT_EXPIRATION_ADMIN':
            return '2h';
          default:
            return undefined;
        }
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      email: 'test@test.com',
      password: 'hashedPassword123',
      role: Role.USER,
      createdAt: new Date(),
      acceptedPrivacyPolicy: true,
    };

    it('should successfully log in a regular user', async () => {
      // Act
      const result = await authService.login(mockUser, mockResponse);

      // Assert
      expect(result).toEqual({
        message: 'Connexion réussie',
        tokenPayload: { userId: mockUser.id, role: mockUser.role },
      });
      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: mockUser.id, role: mockUser.role },
        expect.any(Object),
      );
    });

    it('should successfully log in an admin user', async () => {
      // Arrange
      const mockAdminUser = { ...mockUser, role: Role.ADMIN };

      // Act
      const result = await authService.login(mockAdminUser, mockResponse);

      // Assert
      expect(result).toEqual({
        message: 'Connexion réussie',
        tokenPayload: { userId: mockAdminUser.id, role: mockAdminUser.role },
      });
      expect(configService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET_ADMIN');
    });

    it('should throw UnauthorizedException on error', async () => {
      // Arrange
      jest.spyOn(jwtService, 'sign').mockImplementation(() => {
        throw new Error('JWT Error');
      });

      // Act & Assert
      await expect(authService.login(mockUser, mockResponse)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('adminLogin', () => {
    const mockAdmin = {
      id: 1,
      email: 'admin@test.com',
      password: 'hashedPassword123',
      role: Role.ADMIN,
      createdAt: new Date(),
      acceptedPrivacyPolicy: true,
    };

    beforeEach(() => {
      // Configuration par défaut de bcrypt.compare pour chaque test
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    });

    it('should successfully log in an admin', async () => {
      // Arrange
      usersService.getUser.mockResolvedValue(mockAdmin);

      // Act
      const result = await authService.adminLogin(
        'admin@test.com',
        'password123',
        mockResponse,
      );

      // Assert
      expect(result).toBeDefined();
      expect(usersService.getUser).toHaveBeenCalledWith({
        email: 'admin@test.com',
      });
    });

    it('should reject non-admin users', async () => {
      // Arrange
      const mockUser = {
        ...mockAdmin,
        role: Role.USER,
      };
      usersService.getUser.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(
        authService.adminLogin('user@test.com', 'password123', mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject invalid passwords', async () => {
      // Arrange
      usersService.getUser.mockResolvedValue(mockAdmin);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(
        authService.adminLogin('admin@test.com', 'wrongpassword', mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject non-existent users', async () => {
      // Arrange
      usersService.getUser.mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.adminLogin(
          'nonexistent@test.com',
          'password123',
          mockResponse,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

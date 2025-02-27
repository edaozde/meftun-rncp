import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;

  //Ce test garantit que NestJS peut correctement injecter toutes les dépendances dans AuthController.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: UsersService, useValue: {} }, // Mock vide
        { provide: ConfigService, useValue: {} }, // Mock vide
        { provide: JwtService, useValue: {} }, // Mock vide
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it('devrait appeler AuthService.login() avec un utilisateur', () => {
    // Simule un utilisateur
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      role: 'USER', // Remplace par `Role.USER` si tu utilises un enum Prisma
      acceptedPrivacyPolicy: true,
    };

    // Simule la réponse HTTP
    const mockResponse = {} as Response;

    // Mock de la méthode login d'AuthService
    const authServiceMock = {
      login: jest.fn().mockReturnValue({ token: 'fake-jwt-token' }),
    };

    // Remplace l'instance de AuthService par le mock
    controller['authService'] = authServiceMock as unknown as AuthService;

    // Appelle la méthode login()
    const result = controller.login(mockUser, mockResponse);

    // Vérifie que AuthService.login() a été appelé avec le bon utilisateur
    expect(authServiceMock.login).toHaveBeenCalledWith(mockUser, mockResponse);

    // Vérifie que la réponse contient bien un token
    expect(result).toEqual({ token: 'fake-jwt-token' });
  });

  it('devrait renvoyer une erreur si AuthService.login() échoue', async () => {
    // Simule un utilisateur
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      createdAt: new Date(),
      role: 'USER',
      acceptedPrivacyPolicy: true,
    };

    // Simule la réponse HTTP
    const mockResponse = {} as Response;

    // Mock AuthService pour qu'il lève une erreur
    const authServiceMock = {
      login: jest
        .fn()
        .mockRejectedValue(new Error("Échec de l'authentification")),
    };

    // Remplace l'instance de AuthService par le mock
    controller['authService'] = authServiceMock as unknown as AuthService;

    // Vérifie que login() rejette bien une erreur
    await expect(controller.login(mockUser, mockResponse)).rejects.toThrow(
      "Échec de l'authentification",
    );

    // Vérifie que AuthService.login() a bien été appelé
    expect(authServiceMock.login).toHaveBeenCalledWith(mockUser, mockResponse);
  });

  it("devrait renvoyer une erreur si aucun utilisateur n'est fourni", async () => {
    const mockResponse = {} as Response;

    const authServiceMock = {
      login: jest.fn(),
    };

    // Remplace l'instance de AuthService par le mock
    controller['authService'] = authServiceMock as unknown as AuthService;

    await expect(controller.login(undefined, mockResponse)).rejects.toThrow(
      'Utilisateur non fourni',
    );

    expect(authServiceMock.login).not.toHaveBeenCalled();
  });
});

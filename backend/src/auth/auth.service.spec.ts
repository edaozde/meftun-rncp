import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: {} }, // ✅ Mock de UsersService (évite d'appeler la vraie BDD)
        { provide: ConfigService, useValue: {} }, // ✅ Mock de ConfigService (évite les variables d'env)
        { provide: JwtService, useValue: {} }, // ✅ Mock de JwtService (évite de générer de vrais tokens)
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService); // ✅ Récupération d'une instance de AuthService
  });

  it('devrait être défini', () => {
    // ✅ Vérifie que AuthService est bien instancié et accessible
    expect(authService).toBeDefined();
  });
});

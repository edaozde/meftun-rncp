import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../token.payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies.Authentication,
      ]),
      secretOrKeyProvider: (request, rawJwtToken, done) => {
        try {
          const payload = JSON.parse(
            Buffer.from(rawJwtToken.split('.')[1], 'base64').toString(),
          );
          const secret =
            payload.role === 'ADMIN' || payload.role === 'SUPERADMIN'
              ? configService.getOrThrow<string>('JWT_SECRET_ADMIN')
              : configService.getOrThrow<string>('JWT_SECRET_USER');

          done(null, secret);
        } catch (error) {
          done(error);
        }
      },
    });
  }

  validate(payload: TokenPayload) {
    return { userId: payload.userId, role: payload.role };
  }
}

import { Injectable, NestMiddleware, Inject, forwardRef } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../prisma/prisma.service';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    role: 'ADMIN' | 'SUPERADMIN';
  };
}

@Injectable()
export class AuditLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(forwardRef(() => PrismaService))
    private readonly prisma: PrismaService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    res.on('finish', async () => {
      if (
        req.user &&
        (req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN')
      ) {
        const productId = req.params.productId
          ? Number(req.params.productId)
          : null;

        await this.prisma.auditLog.create({
          data: {
            action: `${req.method} ${req.originalUrl}`,
            userId: req.user.userId,
            productId: productId,
          },
        });
      }
    });

    next();
  }
}

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
    // Store the original URL before proceeding
    const originalUrl = req.originalUrl;

    // Add a flag to track if this is a login attempt
    const isLoginAttempt =
      originalUrl.includes('/auth/login') ||
      originalUrl.includes('/auth/admin/login');

    // Store the original response methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Override response methods to capture the response body
    let responseBody: any;
    res.json = function (body: any) {
      responseBody = body;
      return originalJson.call(this, body);
    };
    res.send = function (body: any) {
      responseBody = body;
      return originalSend.call(this, body);
    };

    // Call next() first to let the request proceed
    next();

    // Only create audit log after the request is complete and if it's not a login attempt
    res.on('finish', async () => {
      // Skip if this was a login attempt or if no user is present
      if (isLoginAttempt || !req.user?.userId) {
        return;
      }

      // Only log actions for admin users
      if (req.user.role === 'ADMIN' || req.user.role === 'SUPERADMIN') {
        let productId = req.params.productId
          ? Number(req.params.productId)
          : null;

        // If this is a product creation and we have a response body with an ID
        if (
          req.method === 'POST' &&
          originalUrl === '/products' &&
          responseBody?.id
        ) {
          productId = responseBody.id;
        }

        try {
          await this.prisma.auditLog.create({
            data: {
              action: `${req.method} ${originalUrl}`,
              user: {
                connect: {
                  id: req.user.userId,
                },
              },
              ...(productId && {
                product: {
                  connect: {
                    id: productId,
                  },
                },
              }),
            },
          });
        } catch (error) {
          console.error('Failed to create audit log:', error);
        }
      }
    });
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

//onModuleInit : la connexion a la bdd démarre avec le module, optionnel sinon prisma lazy connection to bdd

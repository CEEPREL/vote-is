import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createPrismaExtended } from './prisma.extends';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private extendedClient: ReturnType<typeof createPrismaExtended>;

  constructor() {
    super({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.extendedClient = createPrismaExtended(this);
    console.log('Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database disconnected');
  }

  get db() {
    return this.extendedClient;
  }
}

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * PrismaService encapsula el cliente de Prisma para compartir la conexión
 * a PostgreSQL en toda la aplicación NestJS.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });

    // Registra advertencias del cliente de Prisma para facilitar el monitoreo.
    this.$on('warn', (event: Prisma.LogEvent) => {
      this.logger.warn(`Prisma warn [${event.target ?? 'general'}]: ${event.message}`);
    });

    // Captura errores de Prisma y los envía al logger centralizado de NestJS.
    this.$on('error', (event: Prisma.LogEvent) => {
      this.logger.error(`Prisma error [${event.target ?? 'general'}]: ${event.message}`);
    });
  }

  /** Inicializa la conexión al arrancar el módulo e informa su estado. */
  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando conexión con la base de datos (Prisma).');
    await this.$connect();
    this.logger.log('Conexión Prisma establecida correctamente.');
  }

  /** Libera la conexión cuando NestJS cierra el módulo e informa el cierre. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Conexión Prisma cerrada.');
  }
}

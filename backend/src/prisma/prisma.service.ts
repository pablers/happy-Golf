import { execSync } from 'node:child_process';

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

    // Despliega migraciones automáticamente para garantizar que las tablas existan.
    this.ensureMigrationsAreApplied();

    await this.$connect();
    this.logger.log('Conexión Prisma establecida correctamente.');
  }

  /** Libera la conexión cuando NestJS cierra el módulo e informa el cierre. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Conexión Prisma cerrada.');
  }

  /** Ejecuta prisma migrate deploy si no se ha desactivado explícitamente. */
  private ensureMigrationsAreApplied(): void {
    // Permite desactivar la auto-aplicación en entornos (tests, CI) donde no sea deseable.
    if (process.env.PRISMA_AUTO_MIGRATE === 'false') {
      this.logger.log('PRISMA_AUTO_MIGRATE=false, se omite prisma migrate deploy.');
      return;
    }

    // Evita ejecutar migraciones dentro del entorno de pruebas para acelerar suites unitarias.
    if (process.env.NODE_ENV === 'test') {
      this.logger.log('NODE_ENV=test, se omite prisma migrate deploy para acelerar las pruebas.');
      return;
    }

    try {
      this.logger.log('Aplicando migraciones pendientes con prisma migrate deploy.');
      execSync('npx prisma migrate deploy', {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: process.env,
      });
      this.logger.log('Migraciones Prisma aplicadas correctamente.');
    } catch (error) {
      // Proporciona un mensaje claro para que el desarrollador sepa cómo corregirlo.
      this.logger.error(
        'No fue posible ejecutar prisma migrate deploy. Revisa DATABASE_URL y la conectividad antes de reiniciar el servicio.',
        (error as Error).stack,
      );
      throw error;
    }
  }
}

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { config as loadEnvFile } from 'dotenv';

/**
 * PrismaService encapsula el cliente de Prisma para compartir la conexin
 * a PostgreSQL en toda la aplicacin NestJS.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
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

    // Captura errores de Prisma y los enva al logger centralizado de NestJS.
    this.$on('error', (event: Prisma.LogEvent) => {
      this.logger.error(`Prisma error [${event.target ?? 'general'}]: ${event.message}`);
    });
  }

  /** Inicializa la conexin al arrancar el mdulo e informa su estado. */
  async onModuleInit(): Promise<void> {
    this.logger.log('Inicializando conexin con la base de datos (Prisma).');

    try {
      await this.$connect();
      this.logger.log('Conexin Prisma establecida correctamente.');

      // Solo ejecutar migraciones si la conexin fue exitosa
      if (process.env.PRISMA_AUTO_MIGRATE !== 'false') {
        this.ensureMigrationsAreApplied();
      }
    } catch (error) {
      this.logger.error('Error al conectar con la base de datos:', (error as Error).message);
      this.logger.warn('El servidor continuarǭ sin base de datos. Algunas funcionalidades no estarǭn disponibles.');
      // No lanzamos el error para permitir que el servidor inicie de todos modos
    }
  }

  /** Libera la conexin cuando NestJS cierra el mdulo e informa el cierre. */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Conexin Prisma cerrada.');
  }

  /** Ejecuta prisma migrate deploy si no se ha desactivado explcitamente. */
  private ensureMigrationsAreApplied(): void {
    // Permite desactivar la auto-aplicacin en entornos (tests, CI) donde no sea deseable.
    if (process.env.PRISMA_AUTO_MIGRATE === 'false') {
      this.logger.log('PRISMA_AUTO_MIGRATE=false, se omite prisma migrate deploy.');
      return;
    }

    // Evita ejecutar migraciones dentro del entorno de pruebas para acelerar suites unitarias.
    if (process.env.NODE_ENV === 'test') {
      this.logger.log('NODE_ENV=test, se omite prisma migrate deploy para acelerar las pruebas.');
      return;
    }

    // Si la variable no existe, intenta cargar el archivo .env correspondiente antes de continuar.
    if (!process.env.DATABASE_URL) {
      const envFilePath = this.resolveEnvFilePath();
      if (envFilePath) {
        this.logger.log(`Cargando variables de entorno desde ${envFilePath} antes de ejecutar migraciones.`);
        loadEnvFile({ path: envFilePath });
      }
    }

    // Omite la auto migracin si, incluso tras cargar el .env, la URL no estǭ definida.
    if (!process.env.DATABASE_URL) {
      this.logger.warn('DATABASE_URL no estǭ definido; se omite prisma migrate deploy.');
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
      // En lugar de crashear, solo advertimos
      this.logger.warn(
        'No fue posible ejecutar prisma migrate deploy. Revisa DATABASE_URL y la conectividad.',
      );
      this.logger.warn('El servidor continuarǭ pero puede tener problemas con la base de datos.');
      // NO lanzamos el error para permitir que el servidor inicie
    }
  }

  /**
   * Determina el archivo .env a cargar segǧn NODE_ENV para exponer DATABASE_URL al proceso actual.
   */
  private resolveEnvFilePath(): string | undefined {
    const cwd = process.cwd();
    const envSuffix = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : undefined;
    const candidates = [envSuffix, '.env'].filter(Boolean).map((file) => join(cwd, file as string));

    for (const file of candidates) {
      if (existsSync(file)) {
        return file;
      }
    }

    this.logger.warn('No se encontr un archivo .env para cargar DATABASE_URL automǭticamente.');
    return undefined;
  }
}

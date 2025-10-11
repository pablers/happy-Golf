import { Module } from '@nestjs/common';
import { HashingService } from './hashing.service';

/**
 * CoreModule ofrece servicios compartidos, facilitando que otros módulos
 * reutilicen dependencias comunes sin duplicar configuraciones.
 */
@Module({
  providers: [HashingService],
  exports: [HashingService],
})
export class CoreModule {}

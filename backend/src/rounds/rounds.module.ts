import { Module } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { RoundsController } from './rounds.controller';
import { RoundsRepository } from './rounds.repository';

/** Agrupa controlador, servicio y repositorio de rondas. */
@Module({
  controllers: [RoundsController],
  providers: [RoundsService, RoundsRepository],
})
export class RoundsModule {}

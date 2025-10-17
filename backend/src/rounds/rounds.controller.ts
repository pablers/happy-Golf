import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';

/**
 * Expone endpoints REST para gestionar rondas protegidos por JWT.
 */
@UseGuards(JwtAuthGuard)
@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  /** Lista todas las rondas asociadas al usuario autenticado. */
  @Get()
  async list(@Request() req) {
    return this.roundsService.list(req.user.userId);
  }

  /** Recupera los detalles de una ronda concreta. */
  @Get(':id')
  async getById(@Request() req, @Param('id') id: string) {
    return this.roundsService.getById(req.user.userId, id);
  }

  /** Crea una nueva ronda usando el cuerpo de la petición como fuente de datos. */
  @Post()
  async create(@Request() req, @Body() payload: CreateRoundDto) {
    return this.roundsService.create(req.user.userId, payload);
  }

  /** Permite realizar actualizaciones parciales sobre una ronda existente. */
  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() payload: UpdateRoundDto) {
    return this.roundsService.update(req.user.userId, id, payload);
  }

  /** Elimina una ronda registrada por el usuario. */
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.roundsService.remove(req.user.userId, id);
    return { status: 'ok' };
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RoundsRepository } from './rounds.repository';
import { CreateRoundDto } from './dto/create-round.dto';
import { UpdateRoundDto } from './dto/update-round.dto';
import { Round } from './entities/round.entity';

/**
 * Orquesta la lógica de negocio de rondas manteniendo el repositorio encapsulado.
 */
@Injectable()
export class RoundsService {
  constructor(private readonly roundsRepository: RoundsRepository) {}

  /** Lista todas las rondas del usuario autenticado. */
  async list(userId: string): Promise<Round[]> {
    return this.roundsRepository.findByUserId(userId);
  }

  /** Obtiene una ronda si pertenece al usuario, de lo contrario lanza una excepción. */
  async getById(userId: string, roundId: string): Promise<Round> {
    const round = await this.roundsRepository.findById(roundId);
    if (!round) {
      throw new NotFoundException('Round not found');
    }
    if (round.userId !== userId) {
      throw new ForbiddenException('You cannot access this round');
    }
    return round;
  }

  /** Crea una nueva ronda asociada al usuario actual. */
  async create(userId: string, payload: CreateRoundDto): Promise<Round> {
    return this.roundsRepository.create({
      ...payload,
      userId,
    });
  }

  /** Actualiza una ronda existente garantizando que el propietario sea el usuario. */
  async update(userId: string, roundId: string, payload: UpdateRoundDto): Promise<Round> {
    await this.ensureOwnership(userId, roundId);
    const updated = await this.roundsRepository.update(roundId, payload);
    if (!updated) {
      throw new NotFoundException('Round not found');
    }
    return updated;
  }

  /** Elimina la ronda solicitada si pertenece al usuario. */
  async remove(userId: string, roundId: string): Promise<void> {
    await this.ensureOwnership(userId, roundId);
    await this.roundsRepository.remove(roundId);
  }

  /** Verifica que la ronda existe y pertenece al usuario, reutilizando la lógica de control de acceso. */
  private async ensureOwnership(userId: string, roundId: string): Promise<void> {
    await this.getById(userId, roundId);
  }
}

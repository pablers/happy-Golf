import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  CreateRoundInput,
  Round,
  UpdateRoundInput,
} from './entities/round.entity';

/**
 * Gestiona la persistencia en memoria de las rondas hasta migrar a una base de datos real.
 */
@Injectable()
export class RoundsRepository {
  private readonly rounds = new Map<string, Round>();

  /** Devuelve todas las rondas de un usuario ordenadas de más reciente a más antigua. */
  async findByUserId(userId: number): Promise<Round[]> {
    return Array.from(this.rounds.values())
      .filter(round => round.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /** Busca una ronda por su identificador único. */
  async findById(roundId: string): Promise<Round | undefined> {
    return this.rounds.get(roundId);
  }

  /**
   * Crea una nueva ronda generando un identificador único y sellos de tiempo coherentes.
   */
  async create(input: CreateRoundInput): Promise<Round> {
    const now = new Date().toISOString();
    const round: Round = {
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    this.rounds.set(round.id, round);
    return round;
  }

  /** Actualiza una ronda existente y refresca la marca de actualización. */
  async update(roundId: string, changes: UpdateRoundInput): Promise<Round | undefined> {
    const existing = this.rounds.get(roundId);
    if (!existing) {
      return undefined;
    }

    // Garantiza que `updatedAt` avance incluso cuando las operaciones ocurren en el mismo milisegundo.
    let updatedAt = new Date().toISOString();
    if (updatedAt === existing.updatedAt) {
      updatedAt = new Date(Date.parse(updatedAt) + 1).toISOString();
    }

    const updated: Round = {
      ...existing,
      ...changes,
      updatedAt,
    };
    this.rounds.set(roundId, updated);
    return updated;
  }

  /** Elimina una ronda por id y devuelve si existía previamente. */
  async remove(roundId: string): Promise<boolean> {
    return this.rounds.delete(roundId);
  }
}

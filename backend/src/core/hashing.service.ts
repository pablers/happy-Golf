import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * HashingService centraliza la lógica para generar y comparar hashes,
 * permitiendo reutilizar la misma configuración en todo el backend.
 */
@Injectable()
export class HashingService {
  private readonly saltRounds = 10;

  /** Genera un hash bcrypt usando el número estándar de rondas. */
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  /** Compara un valor plano contra un hash previamente generado. */
  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}

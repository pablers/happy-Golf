import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRoundInput,
  Round,
  UpdateRoundInput,
} from './entities/round.entity';
import { Round as PrismaRound, GolfCourse, HoleScore, RoundType, PracticeTime, WeatherCondition, WindCondition } from '@prisma/client';

/**
 * Gestiona la persistencia de las rondas utilizando Prisma y PostgreSQL.
 */
@Injectable()
export class RoundsRepository {
  constructor(private readonly prisma: PrismaService) { }

  /** Devuelve todas las rondas de un usuario ordenadas de más reciente a más antigua. */
  async findByUserId(userId: string): Promise<Round[]> {
    const rounds = await this.prisma.round.findMany({
      where: { userId },
      include: {
        course: true,
        scores: {
          orderBy: { hole: 'asc' },
        },
      },
      orderBy: { date: 'desc' },
    });

    return rounds.map(round => this.mapPrismaRoundToDomain(round));
  }

  /** Busca una ronda por su identificador único. */
  async findById(roundId: string): Promise<Round | undefined> {
    const round = await this.prisma.round.findUnique({
      where: { id: roundId },
      include: {
        course: true,
        scores: {
          orderBy: { hole: 'asc' },
        },
      },
    });

    if (!round) return undefined;
    return this.mapPrismaRoundToDomain(round);
  }

  /**
   * Crea una nueva ronda en la base de datos.
   */
  async create(input: CreateRoundInput): Promise<Round> {
    const { setup, scores, answers, date, userId } = input;

    // 1. Buscar o crear el campo de golf
    let courseId = setup.course.id;
    // Intentamos buscar si ya existe para asegurar consistencia, 
    // aunque idealmente el ID debería venir del catálogo.
    // Si el ID es un UUID válido generado por nosotros, asumimos que existe o se creará.
    // Para simplificar, usamos connectOrCreate si tenemos datos suficientes, 
    // o simplemente connect si asumimos que el catálogo está sincronizado.
    // Dado que el frontend puede mandar datos de campos "nuevos" o enriquecidos,
    // usaremos un upsert o connectOrCreate basado en el ID.

    // Nota: Prisma requiere que el campo 'where' sea único. ID lo es.

    const round = await this.prisma.round.create({
      data: {
        date: new Date(date),
        roundType: this.mapRoundType(setup.roundType),
        practiceTime: this.mapPracticeTime(setup.practiceTime),
        weather: this.mapWeather(setup.weather),
        wind: this.mapWind(setup.wind),
        answers: answers as any, // JSON
        user: { connect: { id: userId } },
        course: {
          connectOrCreate: {
            where: { id: setup.course.id },
            create: {
              id: setup.course.id,
              name: setup.course.name,
              municipality: setup.course.municipality,
              region: setup.course.region,
            },
          },
        },
        scores: {
          create: scores.map(s => ({
            hole: s.hole,
            par: s.par,
            strokeIndex: s.strokeIndex,
            strokes: s.strokes,
            putts: s.putts,
            comment: s.comment,
            fairwayHit: s.fairwayHit,
          })),
        },
      },
      include: {
        course: true,
        scores: {
          orderBy: { hole: 'asc' },
        },
      },
    });

    return this.mapPrismaRoundToDomain(round);
  }

  /** Actualiza una ronda existente. */
  async update(roundId: string, changes: UpdateRoundInput): Promise<Round | undefined> {
    // Nota: Esta implementación es básica y asume que se pueden actualizar campos de primer nivel.
    // Actualizar scores o setup complejos requeriría más lógica (borrar y recrear scores, etc).
    // Por ahora, implementaremos lo básico si es necesario, o lanzaremos error si no se soporta.

    // De momento, el frontend no parece usar update masivo de rondas, salvo quizás para editar detalles.
    // Si changes incluye 'scores', habría que manejarlo con cuidado.

    // Implementación simplificada: solo actualiza campos directos si existen en changes.
    // Si se necesita actualizar scores, se debería hacer en una operación separada o ampliar esto.

    try {
      const updated = await this.prisma.round.update({
        where: { id: roundId },
        data: {
          // Mapeo de campos simples si vinieran en changes...
          // Por ahora el tipo UpdateRoundInput es muy amplio.
          // Se deja pendiente la implementación completa de update 
          // hasta que se defina bien el caso de uso de edición.
          updatedAt: new Date(),
        },
        include: {
          course: true,
          scores: { orderBy: { hole: 'asc' } }
        }
      });
      return this.mapPrismaRoundToDomain(updated);
    } catch (e) {
      return undefined;
    }
  }

  /** Elimina una ronda por id. */
  async remove(roundId: string): Promise<boolean> {
    try {
      await this.prisma.round.delete({
        where: { id: roundId },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // --- Mappers ---

  private mapPrismaRoundToDomain(
    prismaRound: PrismaRound & { course: GolfCourse; scores: HoleScore[] }
  ): Round {
    return {
      id: prismaRound.id,
      userId: prismaRound.userId,
      date: prismaRound.date.toISOString(),
      createdAt: prismaRound.createdAt.toISOString(),
      updatedAt: prismaRound.updatedAt.toISOString(),
      answers: prismaRound.answers as any,
      setup: {
        course: {
          id: prismaRound.course.id,
          name: prismaRound.course.name,
          municipality: prismaRound.course.municipality,
          region: prismaRound.course.region,
        },
        roundType: this.mapRoundTypeReverse(prismaRound.roundType),
        practiceTime: this.mapPracticeTimeReverse(prismaRound.practiceTime),
        weather: this.mapWeatherReverse(prismaRound.weather),
        wind: this.mapWindReverse(prismaRound.wind),
      },
      scores: prismaRound.scores.map(s => ({
        hole: s.hole,
        par: s.par,
        strokeIndex: s.strokeIndex,
        strokes: s.strokes,
        putts: s.putts,
        comment: s.comment,
        fairwayHit: s.fairwayHit,
      })),
    };
  }

  private mapRoundType(type: string): RoundType {
    switch (type) {
      case 'front': return RoundType.FRONT;
      case 'back': return RoundType.BACK;
      case 'full': return RoundType.FULL;
      default: return RoundType.FULL;
    }
  }

  private mapRoundTypeReverse(type: RoundType): 'front' | 'back' | 'full' {
    switch (type) {
      case RoundType.FRONT: return 'front';
      case RoundType.BACK: return 'back';
      case RoundType.FULL: return 'full';
    }
  }

  private mapPracticeTime(type: string): PracticeTime {
    switch (type) {
      case 'none': return PracticeTime.NONE;
      case '5min': return PracticeTime.MIN_5;
      case '5-15min': return PracticeTime.MIN_5_15;
      case '15+min': return PracticeTime.MIN_15_PLUS;
      default: return PracticeTime.NONE;
    }
  }

  private mapPracticeTimeReverse(type: PracticeTime): 'none' | '5min' | '5-15min' | '15+min' {
    switch (type) {
      case PracticeTime.NONE: return 'none';
      case PracticeTime.MIN_5: return '5min';
      case PracticeTime.MIN_5_15: return '5-15min';
      case PracticeTime.MIN_15_PLUS: return '15+min';
    }
  }

  private mapWeather(type: string): WeatherCondition {
    switch (type) {
      case 'sunny': return WeatherCondition.SUNNY;
      case 'cloudy': return WeatherCondition.CLOUDY;
      case 'rainy': return WeatherCondition.RAINY;
      case 'variable': return WeatherCondition.VARIABLE;
      default: return WeatherCondition.SUNNY;
    }
  }

  private mapWeatherReverse(type: WeatherCondition): 'sunny' | 'cloudy' | 'rainy' | 'variable' {
    switch (type) {
      case WeatherCondition.SUNNY: return 'sunny';
      case WeatherCondition.CLOUDY: return 'cloudy';
      case WeatherCondition.RAINY: return 'rainy';
      case WeatherCondition.VARIABLE: return 'variable';
    }
  }

  private mapWind(type: string): WindCondition {
    switch (type) {
      case 'none': return WindCondition.NONE;
      case 'light': return WindCondition.LIGHT;
      case 'moderate': return WindCondition.MODERATE;
      case 'strong': return WindCondition.STRONG;
      default: return WindCondition.NONE;
    }
  }

  private mapWindReverse(type: WindCondition): 'none' | 'light' | 'moderate' | 'strong' {
    switch (type) {
      case WindCondition.NONE: return 'none';
      case WindCondition.LIGHT: return 'light';
      case WindCondition.MODERATE: return 'moderate';
      case WindCondition.STRONG: return 'strong';
    }
  }
}

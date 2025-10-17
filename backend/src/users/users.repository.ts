import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput, PublicUser, User } from './entities/user.entity';
import { UserProfile } from './user.interface';

const userWithProfile = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    profile: {
      include: {
        hcpHistory: true,
        favoriteCourses: true,
      },
    },
  },
});

type PrismaUserWithProfile = Prisma.UserGetPayload<typeof userWithProfile>;

/**
 * UsersRepository centraliza las operaciones de persistencia utilizando Prisma.
 */
@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Busca un usuario por email incluyendo su perfil y relaciones auxiliares. */
  async findByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: userWithProfile.include,
      });
      return user ? this.mapUser(user) : undefined;
    } catch (error) {
      throw this.handlePrismaError(error, `findByEmail(${email})`);
    }
  }

  /** Recupera un usuario por id cuando otros módulos necesitan sus datos. */
  async findById(id: string): Promise<User | undefined> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: userWithProfile.include,
      });
      return user ? this.mapUser(user) : undefined;
    } catch (error) {
      throw this.handlePrismaError(error, `findById(${id})`);
    }
  }

  /**
   * Persiste un nuevo usuario generando el perfil por defecto y devuelve la entidad completa.
   */
  async create(payload: CreateUserInput): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: payload.email,
          password: payload.passwordHash,
          profile: {
            create: this.mapProfileToCreateInput(payload.profile),
          },
        },
        include: userWithProfile.include,
      });
      return this.mapUser(user);
    } catch (error) {
      throw this.handlePrismaError(error, `create(${payload.email})`);
    }
  }

  /**
   * Actualiza el perfil de un usuario reemplazando historial y favoritos con los valores recibidos.
   */
  async updateProfile(userId: string, profile: User['profile']): Promise<User> {
    try {
      return await this.prisma.$transaction(async tx => {
        const existing = await tx.user.findUnique({
          where: { id: userId },
          include: {
            profile: true,
          },
        });

        if (!existing || !existing.profile) {
          throw new NotFoundException('User not found');
        }

        await tx.profile.update({
          where: { id: existing.profile.id },
          data: {
            name: profile.name,
            trainingObjective: profile.trainingObjective,
            favoriteCourses: {
              set: profile.favoriteCourseIds.map(id => ({ id })),
            },
            hcpHistory: {
              deleteMany: { profileId: existing.profile.id },
              create: profile.hcpHistory.map(record => ({
                date: new Date(record.date),
                hcp: record.hcp,
              })),
            },
          },
        });

        const updated = await tx.user.findUnique({
          where: { id: userId },
          include: userWithProfile.include,
        });

        if (!updated) {
          throw new NotFoundException('User not found');
        }

        return this.mapUser(updated);
      });
    } catch (error) {
      throw this.handlePrismaError(error, `updateProfile(${userId})`);
    }
  }

  /** Convierte un usuario completo a su representación pública. */
  toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  /** Transforma el payload de perfil al formato de creación anidada de Prisma. */
  private mapProfileToCreateInput(profile: UserProfile): Prisma.ProfileCreateWithoutUserInput {
    return {
      name: profile.name,
      trainingObjective: profile.trainingObjective,
      favoriteCourses: profile.favoriteCourseIds.length
        ? { connect: profile.favoriteCourseIds.map(id => ({ id })) }
        : undefined,
      hcpHistory: profile.hcpHistory.length
        ? {
            create: profile.hcpHistory.map(record => ({
              date: new Date(record.date),
              hcp: record.hcp,
            })),
          }
        : undefined,
    };
  }

  /** Normaliza la estructura que Prisma devuelve a la interfaz de dominio del servicio. */
  private mapUser(user: PrismaUserWithProfile): User {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: this.mapProfile(user.profile ?? undefined),
    };
  }

  private mapProfile(profile?: PrismaUserWithProfile['profile']): UserProfile {
    const history = profile?.hcpHistory ?? [];
    return {
      name: profile?.name ?? '',
      trainingObjective: profile?.trainingObjective ?? 'recommended',
      favoriteCourseIds: profile?.favoriteCourses?.map(course => course.id) ?? [],
      hcpHistory: history
        .slice()
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map(record => ({
          date: record.date.toISOString(),
          hcp: record.hcp,
        })),
    };
  }

  /** Traductor de errores de Prisma hacia excepciones HTTP semánticas. */
  private handlePrismaError(error: unknown, context: string): HttpException {
    if (error instanceof HttpException) {
      return error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        this.logger.warn(`Conflicto de unicidad en ${context}: ${error.message}`);
        return new ConflictException('User with this email already exists');
      }

      if (error.code === 'P2025') {
        return new NotFoundException('User not found');
      }
    }

    const message = `Unexpected database error while executing ${context}`;
    if (error instanceof Error) {
      this.logger.error(message, error.stack);
    } else {
      this.logger.error(message);
    }
    return new InternalServerErrorException('Database operation failed');
  }
}

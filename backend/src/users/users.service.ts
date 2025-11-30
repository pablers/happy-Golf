import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { HashingService } from '../core/hashing.service';
import { UserProfile } from './user.interface';
import { CreateUserInput, PublicUser, User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly usersRepository: UsersRepository,
  ) { }

  /** Busca un usuario por correo electrónico para los flujos de autenticación. */
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  /** Recupera un usuario por id cuando otros módulos necesitan información detallada. */
  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findById(id);
  }

  /**
   * Registra un usuario nuevo delegando la persistencia en el repositorio.
   * Devuelve una vista pública sin exponer el hash de la contraseña.
   */
  async create(email: string, password: string, name: string): Promise<PublicUser> {
    const existingUser = await this.usersRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const payload: CreateUserInput = {
      email,
      passwordHash: await this.hashingService.hash(password),
      profile: this.buildDefaultProfile(name),
    };

    const newUser = await this.usersRepository.create(payload);
    return this.usersRepository.toPublicUser(newUser);
  }

  /** Actualiza el perfil de un usuario en el repositorio. */
  async updateProfile(userId: string, profileData: UserProfile): Promise<User> {
    return this.usersRepository.updateProfile(userId, profileData);
  }

  /**
   * Obtiene un usuario en formato seguro o lanza una excepción si no existe.
   */
  async getPublicUserById(userId: string): Promise<PublicUser> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersRepository.toPublicUser(user);
  }

  /** Genera el perfil inicial con valores por defecto coherentes. */
  private buildDefaultProfile(name: string): UserProfile {
    return {
      name,
      hcpHistory: [{ date: new Date().toISOString(), hcp: 36.0 }],
      favoriteCourseIds: [],
      trainingObjective: 'recommended',
    };
  }
}

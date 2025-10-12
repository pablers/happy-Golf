import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput, PublicUser, User } from './entities/user.entity';

/**
 * UsersRepository centraliza las operaciones sobre el almacenamiento en memoria.
 */
@Injectable()
export class UsersRepository {
  // Almacén en memoria para simplificar el ejemplo.
  private readonly users: User[] = [];

  /** Busca un usuario por email para soportar el flujo de login. */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  /** Recupera un usuario por id cuando otros módulos necesitan sus datos. */
  async findById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  /** Persiste un nuevo usuario asignando un identificador incremental. */
  async create(payload: CreateUserInput): Promise<User> {
    const newUser: User = {
      id: this.users.length + 1,
      ...payload,
    };
    this.users.push(newUser);
    return newUser;
  }

  /** Actualiza el perfil de un usuario asegurando que exista. */
  async updateProfile(userId: number, profile: User['profile']): Promise<User> {
    const index = this.users.findIndex(user => user.id === userId);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    const updatedUser: User = {
      ...this.users[index],
      profile,
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  /** Convierte un usuario completo a su representación pública. */
  toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }
}

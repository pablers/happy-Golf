import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserProfile } from '../users/user.interface';

/**
 * Centraliza la lógica de negocio relacionada con los perfiles de usuario.
 */
@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Obtiene el perfil del usuario autenticado asegurando que exista en el sistema.
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.profile;
  }

  /**
   * Actualiza la información del perfil delegando la persistencia al servicio de usuarios.
   */
  async updateProfile(userId: string, profileData: UserProfile): Promise<UserProfile> {
    const updatedUser = await this.usersService.updateProfile(userId, profileData);
    return updatedUser.profile;
  }
}

import { UserProfile } from '../user.interface';

/**
 * User define la estructura persistida para los usuarios gestionados en memoria.
 */
export interface User {
  id: number;
  email: string;
  passwordHash: string;
  profile: UserProfile;
}

/**
 * PublicUser expone los datos seguros sin el hash de contraseña.
 */
export type PublicUser = Omit<User, 'passwordHash'>;

/**
 * Datos necesarios para registrar un usuario en el repositorio.
 */
export interface CreateUserInput {
  email: string;
  passwordHash: string;
  profile: UserProfile;
}

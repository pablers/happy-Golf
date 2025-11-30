import { UserProfile } from '../user.interface';

/**
 * User representa la entidad persistida en PostgreSQL a través de Prisma.
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
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

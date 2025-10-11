import { Injectable, ConflictException } from '@nestjs/common';
import { HashingService } from '../core/hashing.service';
import { UserProfile } from './user.interface';

// This is a mock user type for our in-memory database
export type User = {
    id: number;
    email: string;
    passwordHash: string;
    profile: UserProfile;
};

@Injectable()
export class UsersService {
  // Mantiene un array en memoria para simplificar el ejemplo.
  private readonly users: User[] = [];

  constructor(private readonly hashingService: HashingService) {
    // Pre-seed a user for easy testing
    this.create('pablo@test.com', 'password123', 'Pablo Reina').catch(console.error);
  }

  // Busca un usuario por correo para validaciones de login o registro.
  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  // Localiza un usuario por id para exponer datos relacionados al perfil.
  async findOneById(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  // Registra un nuevo usuario y protege la contraseña con bcrypt.
  async create(email: string, password: string, name: string): Promise<User> {
    if (this.users.some(user => user.email === email)) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.hashingService.hash(password);
    
    const newUser: User = {
      id: this.users.length + 1,
      email,
      passwordHash,
      profile: {
        name,
        hcpHistory: [{ date: new Date().toISOString(), hcp: 18.0 }], // Default HCP history
        favoriteCourseIds: [],
        trainingObjective: 'recommended',
      },
    };
    this.users.push(newUser);
    return newUser;
  }

  // Actualiza la información de perfil asociada a un usuario ya existente.
  async updateProfile(userId: number, profileData: UserProfile): Promise<User> {
      const userIndex = this.users.findIndex(user => user.id === userId);
      if (userIndex === -1) {
          throw new Error('User not found');
      }
      this.users[userIndex].profile = profileData;
      return this.users[userIndex];
  }
}

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashingService } from '../core/hashing.service';

// AuthService coordina la autenticación y delega la verificación en UsersService.
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) { }

  // Valida credenciales contrastando el hash almacenado con el valor recibido.
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await this.hashingService.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  // Genera el token JWT cuando las credenciales son correctas.
  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      profile: user.profile,
    };
  }

  // Registra usuarios nuevos y devuelve un token válido tras la creación.
  async register(email: string, pass: string, name: string) {
    try {
      const newUser = await this.usersService.create(email, pass, name);
      const payload = { sub: newUser.id, email: newUser.email };
      return {
        access_token: this.jwtService.sign(payload),
        profile: newUser.profile,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }

  // Completa el perfil del usuario con los datos del onboarding.
  async completeProfile(userId: string, handicap: number, trainingObjective: string, favoriteCourseIds: string[]) {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updatedProfile = {
      ...user.profile,
      hcpHistory: [{ date: new Date().toISOString(), hcp: handicap }],
      trainingObjective,
      favoriteCourseIds,
    };

    await this.usersService.updateProfile(userId, updatedProfile);
    return updatedProfile;
  }
}

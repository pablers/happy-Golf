import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    const { ...profile } = user;
    return {
      access_token: this.jwtService.sign(payload),
      profile: profile,
    };
  }

  async register(email: string, pass:string, name: string) {
    try {
      const newUser = await this.usersService.create(email, pass, name);
      const payload = { sub: newUser.id, email: newUser.email };
      const { password, ...profile } = newUser;
      return {
        access_token: this.jwtService.sign(payload),
        profile: profile,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }
}

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserProfile } from 'src/users/user.interface';
import { User, HcpRecord as PrismaHcpRecord } from '@prisma/client';

// We need a type that includes the hcpHistory relation
type UserWithHistory = User & { hcpHistory: PrismaHcpRecord[] };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private buildProfile(user: UserWithHistory): UserProfile {
    return {
      name: user.name,
      hcpHistory: user.hcpHistory.map(record => ({
        date: record.date.toISOString(),
        hcp: record.hcp,
      })),
      favoriteCourseIds: user.favoriteCourseIds,
      trainingObjective: user.trainingObjective,
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
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
    return {
      access_token: this.jwtService.sign(payload),
      profile: this.buildProfile(user),
    };
  }

  async register(email: string, pass:string, name: string) {
    try {
      // The create method already includes the hcpHistory
      const newUser = await this.usersService.create(email, pass, name);
      const payload = { sub: newUser.id, email: newUser.email };
      return {
        access_token: this.jwtService.sign(payload),
        profile: this.buildProfile(newUser as UserWithHistory),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }
}

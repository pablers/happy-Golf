import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashingService } from '../core/hashing.service';
import { UserProfile } from '../users/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) { }

  async login(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await this.hashingService.compare(pass, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    };
  }

  async register(email: string, pass: string, name: string) {
    const user = await this.usersService.create(email, pass, name);
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

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

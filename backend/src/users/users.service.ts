import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, Profile } from '@prisma/client';
import { UserProfile as UserProfileDto } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<(User & { profile: Profile | null }) | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }
  
  async findOneById(id: string): Promise<User & { profile: Profile }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!user || !user.profile) {
      throw new NotFoundException('User or profile not found');
    }
    return user as User & { profile: Profile };
  }

  async create(email: string, password: string, name: string): Promise<User & { profile: Profile }> {
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          create: {
            name,
            trainingObjective: 'recommended',
            hcpHistory: {
              create: {
                date: new Date(),
                hcp: 18.0,
              },
            },
          },
        },
      },
      include: {
        profile: true,
      },
    });
    return user as User & { profile: Profile };
  }

  async updateProfile(userId: string, profileData: UserProfileDto): Promise<Profile> {
      const user = await this.findOneById(userId);
      // findOneById already ensures the profile exists.

      return this.prisma.profile.update({
          where: { id: user.profile.id },
          data: {
              name: profileData.name,
              trainingObjective: profileData.trainingObjective,
          },
      });
  }
}
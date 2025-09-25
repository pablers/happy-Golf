import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  
  async findOneById(id: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(email: string, password: string, name: string): Promise<User> {
    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        hcp: 18.0, // Default HCP
      },
    });
  }

  async updateProfile(userId: string, profileData: Partial<User>): Promise<User> {
      const user = await this.findOneById(userId);
      if (!user) {
          throw new NotFoundException('User not found');
      }

      const { id, email, passwordHash, createdAt, updatedAt, ...restOfProfileData } = profileData;

      return this.prisma.user.update({
          where: { id: userId },
          data: restOfProfileData,
      });
  }
}

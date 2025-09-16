import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserProfile } from './user.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { hcpHistory: true },
    });
  }
  
  async findOneById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { hcpHistory: true },
    });
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
        favoriteCourseIds: [],
        trainingObjective: 'recommended',
        hcpHistory: {
          create: [
            {
              date: new Date(),
              hcp: 18.0,
            },
          ],
        },
      },
      include: {
        hcpHistory: true,
      },
    });
  }

  async updateProfile(userId: number, profileData: UserProfile): Promise<User> {
    const { hcpHistory, ...profileFields } = profileData;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update the scalar fields on the User
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          ...profileFields,
        },
      });

      // 2. Delete existing HCP records
      await tx.hcpRecord.deleteMany({
        where: { userId: userId },
      });

      // 3. Create new HCP records
      await tx.hcpRecord.createMany({
        data: hcpHistory.map((record) => ({
          userId: userId,
          date: new Date(record.date),
          hcp: record.hcp,
        })),
      });

      // 4. Return the user with the updated history
      return tx.user.findUnique({
        where: { id: userId },
        include: { hcpHistory: true },
      });
    });
  }
}

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

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
    
    const userModel = Prisma.dmmf.datamodel.models.find((model) => model.name === 'User');
    const userData: Record<string, unknown> = {
      email,
      passwordHash,
      name,
    };

    if (userModel?.fields.some((field) => field.name === 'hcp')) {
      userData.hcp = 18.0; // Default HCP solo si la columna existe.
    }

    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateProfile(userId: string, profileData: Partial<User>): Promise<User> {
      const user = await this.findOneById(userId);
      if (!user) {
          throw new NotFoundException('User not found');
      }

    const { id, email, passwordHash, createdAt, updatedAt, ...restOfProfileData } = profileData;

    const userModel = Prisma.dmmf.datamodel.models.find((model) => model.name === 'User');
    const editableFields = new Set(
      userModel?.fields
        .map((field) => field.name)
        .filter((fieldName) => !['id', 'email', 'passwordHash', 'createdAt', 'updatedAt'].includes(fieldName)) ?? [],
    );

    const sanitizedProfileData = Object.fromEntries(
      Object.entries(restOfProfileData).filter(([key]) => editableFields.has(key)),
    );

    return this.prisma.user.update({
        where: { id: userId },
        data: sanitizedProfileData,
    });
  }
}

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<Record<string, any> | null> {
    return (await this.prisma.user.findUnique({ where: { email } })) as Record<string, any> | null;
  }

  async findOneById(id: string): Promise<Record<string, any> | null> {
    return (await this.prisma.user.findUnique({ where: { id } })) as Record<string, any> | null;
  }

  async create(email: string, password: string, name: string): Promise<Record<string, any>> {
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
      },
    }) as unknown as Record<string, any>;
  }

  async updateProfile(userId: string, profileData: Partial<Record<string, any>>): Promise<Record<string, any>> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatePayload: Record<string, unknown> = {};

    if (typeof profileData.name === 'string') {
      updatePayload.name = profileData.name;
    }

    // Solo escribimos el hándicap cuando la columna existe en el esquema actual.
    if ('hcp' in user && typeof profileData.hcp === 'number') {
      updatePayload.hcp = profileData.hcp;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: updatePayload,
    }) as unknown as Record<string, any>;
  }
}

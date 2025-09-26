import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Round, HoleScore } from '@prisma/client';

@Injectable()
export class RoundsService {
  constructor(private prisma: PrismaService) {}

  async createRound(data: any): Promise<Round> {
    return this.prisma.round.create({ data });
  }

  async getRounds(userId: string): Promise<Round[]> {
    return this.prisma.round.findMany({
      where: { userId },
      include: { scores: true },
    });
  }

  async getRoundById(id: string): Promise<Round | null> {
    return this.prisma.round.findUnique({
      where: { id },
      include: { scores: true },
    });
  }

  async updateRound(id: string, data: any): Promise<Round> {
    return this.prisma.round.update({
      where: { id },
      data,
    });
  }

  async deleteRound(id: string): Promise<Round> {
    // First, delete the associated hole scores
    await this.prisma.holeScore.deleteMany({
        where: { roundId: id },
    });
    // Then, delete the round itself
    return this.prisma.round.delete({
        where: { id },
    });
  }
}
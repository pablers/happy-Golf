import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Round } from '@prisma/client';

@Injectable()
export class RoundsService {
  constructor(private prisma: PrismaService) {}

  async create(createRoundDto: any, userId: string): Promise<Round> {
    const { holeScores, ...roundData } = createRoundDto;
    return this.prisma.round.create({
      data: {
        ...roundData,
        user: {
          connect: { id: userId },
        },
        holeScores: {
          create: holeScores,
        },
      },
      include: {
        holeScores: true,
      },
    });
  }

  async findAll(userId: string): Promise<Round[]> {
    return this.prisma.round.findMany({
      where: { userId },
      include: {
        holeScores: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<Round | null> {
    const round = await this.prisma.round.findUnique({
      where: { id },
      include: {
        holeScores: true,
        postRoundAnswers: true,
      },
    });
    if (!round) {
        throw new NotFoundException(`Round with ID ${id} not found`);
    }
    return round;
  }

  async update(id: string, updateRoundDto: any): Promise<Round> {
    // For now, we only support updating the main round data, not the hole scores.
    const { holeScores, ...roundData } = updateRoundDto;
    return this.prisma.round.update({
      where: { id },
      data: roundData,
    });
  }

  async remove(id: string): Promise<Round> {
    return this.prisma.round.delete({
      where: { id },
    });
  }
}

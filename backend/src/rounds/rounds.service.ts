import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Round, Prisma } from '@prisma/client';

// Define a type for the creation payload that the service will accept
export type CreateRoundPayload = Omit<Prisma.RoundCreateInput, 'user' | 'course' | 'scores'> & {
    userId: string;
    courseId: string;
    scores: Prisma.HoleScoreCreateWithoutRoundInput[];
};

@Injectable()
export class RoundsService {
  constructor(private prisma: PrismaService) {}

  async createRound(payload: CreateRoundPayload): Promise<Round> {
    const { userId, courseId, scores, ...roundData } = payload;
    return this.prisma.round.create({
        data: {
            ...roundData,
            user: { connect: { id: userId } },
            course: { connect: { id: courseId } },
            scores: {
                create: scores,
            },
        },
        include: { scores: true, course: true },
    });
  }

  async getRounds(userId: string): Promise<Round[]> {
    return this.prisma.round.findMany({
      where: { userId },
      include: { scores: true, course: true },
    });
  }

  async getRoundById(id: string): Promise<Round | null> {
    return this.prisma.round.findUnique({
      where: { id },
      include: { scores: true, course: true },
    });
  }

  async updateRound(id: string, data: Prisma.RoundUpdateInput): Promise<Round> {
    return this.prisma.round.update({
      where: { id },
      data,
      include: { scores: true, course: true },
    });
  }

  async deleteRound(id: string): Promise<Round> {
    // The schema's `onDelete: Cascade` handles the deletion of associated HoleScore records.
    return this.prisma.round.delete({
        where: { id },
    });
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoundDto } from './dto/create-round.dto';

@Injectable()
export class RoundsService {
    constructor(private prisma: PrismaService) {}

    async create(userId: number, createRoundDto: CreateRoundDto) {
        const { holes, ...roundData } = createRoundDto;

        return this.prisma.round.create({
            data: {
                ...roundData,
                user: {
                    connect: { id: userId },
                },
                date: new Date(), // Use server time for the round date
                holes: {
                    create: holes.map(hole => ({
                        holeNumber: hole.holeNumber,
                        strokes: hole.strokes,
                        putts: hole.putts,
                        comment: hole.comment,
                        fairwayHit: hole.fairwayHit,
                    })),
                },
            },
            include: {
                holes: true, // Include the created holes in the return object
            },
        });
    }

    async findAllForUser(userId: number) {
        return this.prisma.round.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            include: { holes: true },
        });
    }

    async findOneById(roundId: string) {
        const round = await this.prisma.round.findUnique({
            where: { id: roundId },
            include: { holes: true },
        });

        if (!round) {
            throw new NotFoundException(`Round with ID ${roundId} not found`);
        }

        return round;
    }
}

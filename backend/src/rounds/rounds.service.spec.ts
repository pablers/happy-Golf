import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { RoundsRepository } from './rounds.repository';
import { CreateRoundDto } from './dto/create-round.dto';
import { PrismaService } from '../prisma/prisma.service';

// Mock simple de PrismaService
const mockPrismaService = {
  round: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as unknown as PrismaService;

// Crea instancias reales para validar el flujo completo del servicio.
const buildService = () => new RoundsService(new RoundsRepository(mockPrismaService));

const baseRoundPayload: CreateRoundDto = {
  date: '2024-06-01T10:00:00.000Z',
  setup: {
    course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES' },
    roundType: 'full',
    practiceTime: '15+min',
    weather: 'sunny',
    wind: 'light',
  },
  scores: [
    {
      hole: 1,
      par: 4,
      strokeIndex: 10,
      strokes: 5,
      putts: 2,
      comment: 'Primer hoyo',
      fairwayHit: true,
    },
  ],
  answers: {
    practice_time: '15+min',
    initial_weather: 'sunny',
    initial_wind: 'light',
  },
};

describe('RoundsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('crea y lista rondas asociadas a un usuario', async () => {
    const service = buildService();

    // Mock create return
    (mockPrismaService.round.create as jest.Mock).mockResolvedValue({
      id: 'round-1',
      userId: 'user-1',
      date: new Date(baseRoundPayload.date),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: baseRoundPayload.answers,
      roundType: 'FULL',
      practiceTime: 'MIN_15_PLUS',
      weather: 'SUNNY',
      wind: 'LIGHT',
      courseId: 'course-1',
      course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES', address: null, province: null, phone: null, email: null, url: null, latitude: null, longitude: null },
      scores: [],
    });

    // Mock findMany return
    (mockPrismaService.round.findMany as jest.Mock).mockResolvedValue([{
      id: 'round-1',
      userId: 'user-1',
      date: new Date(baseRoundPayload.date),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: baseRoundPayload.answers,
      roundType: 'FULL',
      practiceTime: 'MIN_15_PLUS',
      weather: 'SUNNY',
      wind: 'LIGHT',
      courseId: 'course-1',
      course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES', address: null, province: null, phone: null, email: null, url: null, latitude: null, longitude: null },
      scores: [],
    }]);

    const created = await service.create('user-1', baseRoundPayload);

    expect(created.id).toBeDefined();
    expect(created.userId).toBe('user-1');

    const rounds = await service.list('user-1');
    expect(rounds).toHaveLength(1);
    expect(rounds[0].id).toBe(created.id);
  });

  it('impide acceder a rondas de otros usuarios', async () => {
    const service = buildService();

    // Mock create return
    (mockPrismaService.round.create as jest.Mock).mockResolvedValue({
      id: 'round-1',
      userId: 'user-1',
      date: new Date(baseRoundPayload.date),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: baseRoundPayload.answers,
      roundType: 'FULL',
      practiceTime: 'MIN_15_PLUS',
      weather: 'SUNNY',
      wind: 'LIGHT',
      courseId: 'course-1',
      course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES', address: null, province: null, phone: null, email: null, url: null, latitude: null, longitude: null },
      scores: [],
    });

    // Mock findUnique return
    (mockPrismaService.round.findUnique as jest.Mock).mockResolvedValue({
      id: 'round-1',
      userId: 'user-1',
      date: new Date(baseRoundPayload.date),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: baseRoundPayload.answers,
      roundType: 'FULL',
      practiceTime: 'MIN_15_PLUS',
      weather: 'SUNNY',
      wind: 'LIGHT',
      courseId: 'course-1',
      course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES', address: null, province: null, phone: null, email: null, url: null, latitude: null, longitude: null },
      scores: [],
    });

    const created = await service.create('user-1', baseRoundPayload);

    await expect(service.getById('user-2', created.id)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('permite actualizar y elimina rondas existentes', async () => {
    const service = buildService();

    // Mock create
    (mockPrismaService.round.create as jest.Mock).mockResolvedValue({
      id: 'round-1',
      userId: 'user-1',
      date: new Date(baseRoundPayload.date),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: baseRoundPayload.answers,
      roundType: 'FULL',
      practiceTime: 'MIN_15_PLUS',
      weather: 'SUNNY',
      wind: 'LIGHT',
      courseId: 'course-1',
      course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES', address: null, province: null, phone: null, email: null, url: null, latitude: null, longitude: null },
      scores: [],
    });

    const created = await service.create('user-1', baseRoundPayload);

    // Mock findUnique for getById check
    (mockPrismaService.round.findUnique as jest.Mock).mockResolvedValue({
      id: 'round-1',
      userId: 'user-1',
      date: new Date(baseRoundPayload.date),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: baseRoundPayload.answers,
      roundType: 'FULL',
      practiceTime: 'MIN_15_PLUS',
      weather: 'SUNNY',
      wind: 'LIGHT',
      courseId: 'course-1',
      course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES', address: null, province: null, phone: null, email: null, url: null, latitude: null, longitude: null },
      scores: [],
    });

    // Mock update
    (mockPrismaService.round.update as jest.Mock).mockResolvedValue({
      id: 'round-1',
      userId: 'user-1',
      date: new Date(baseRoundPayload.date),
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: { ...baseRoundPayload.answers, physical_state: 'good' },
      roundType: 'FULL',
      practiceTime: 'MIN_15_PLUS',
      weather: 'SUNNY',
      wind: 'LIGHT',
      courseId: 'course-1',
      course: { id: 'course-1', name: 'Test Course', municipality: 'Madrid', region: 'ES', address: null, province: null, phone: null, email: null, url: null, latitude: null, longitude: null },
      scores: [],
    });

    const updated = await service.update('user-1', created.id, { answers: { physical_state: 'good' } });
    expect(updated.answers.physical_state).toBe('good');

    // Mock delete
    (mockPrismaService.round.delete as jest.Mock).mockResolvedValue({});

    await service.remove('user-1', created.id);

    // Mock findUnique returning null for subsequent getById
    (mockPrismaService.round.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.getById('user-1', created.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});

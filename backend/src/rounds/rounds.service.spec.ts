import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { RoundsRepository } from './rounds.repository';
import { CreateRoundDto } from './dto/create-round.dto';

// Crea instancias reales para validar el flujo completo del servicio.
const buildService = () => new RoundsService(new RoundsRepository());

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
  it('crea y lista rondas asociadas a un usuario', async () => {
    const service = buildService();
    const created = await service.create('user-1', baseRoundPayload);

    expect(created.id).toBeDefined();
    expect(created.userId).toBe('user-1');

    const rounds = await service.list('user-1');
    expect(rounds).toHaveLength(1);
    expect(rounds[0].id).toBe(created.id);
  });

  it('impide acceder a rondas de otros usuarios', async () => {
    const service = buildService();
    const created = await service.create('user-1', baseRoundPayload);

    await expect(service.getById('user-2', created.id)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('permite actualizar y elimina rondas existentes', async () => {
    const service = buildService();
    const created = await service.create('user-1', baseRoundPayload);

    const updated = await service.update('user-1', created.id, { answers: { physical_state: 'good' } });
    expect(updated.answers.physical_state).toBe('good');
    expect(updated.updatedAt).not.toBe(created.updatedAt);

    await service.remove('user-1', created.id);
    await expect(service.getById('user-1', created.id)).rejects.toBeInstanceOf(NotFoundException);
  });
});

import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { HashingService } from '../core/hashing.service';
import { UsersRepository } from './users.repository';

// Utilidad simple para crear el servicio con dependencias reales.
const buildService = () => new UsersService(new HashingService(), new UsersRepository());

describe('UsersService', () => {
  it('crea un usuario y oculta el hash en la respuesta pública', async () => {
    const service = buildService();
    const publicUser = await service.create('new@test.com', 'password', 'Nuevo Usuario');
    expect(publicUser.email).toBe('new@test.com');
    expect(publicUser).not.toHaveProperty('passwordHash');
    expect(publicUser.profile.name).toBe('Nuevo Usuario');

    const storedUser = await service.findOneByEmail('new@test.com');
    expect(storedUser?.passwordHash).toBeDefined();
    expect(storedUser?.passwordHash).not.toBe('password');
  });

  it('impide registrar dos usuarios con el mismo correo', async () => {
    const service = buildService();
    await service.create('duplicate@test.com', 'password', 'Duplicado');
    await expect(service.create('duplicate@test.com', 'password', 'Duplicado')).rejects.toBeInstanceOf(ConflictException);
  });

  it('obtiene un usuario público por id y lanza si no existe', async () => {
    const service = buildService();
    const created = await service.create('byid@test.com', 'password', 'By Id');

    const publicUser = await service.getPublicUserById(created.id);
    expect(publicUser.email).toBe('byid@test.com');
    expect(publicUser).not.toHaveProperty('passwordHash');

    await expect(service.getPublicUserById(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('actualiza el perfil delegando en el repositorio', async () => {
    const service = buildService();
    const created = await service.create('update@test.com', 'password', 'Actualizar');

    const updated = await service.updateProfile(created.id, {
      ...created.profile,
      trainingObjective: 'custom',
    });
    expect(updated.profile.trainingObjective).toBe('custom');
  });
});

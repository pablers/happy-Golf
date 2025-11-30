import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { HashingService } from '../core/hashing.service';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UserProfile } from './user.interface';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<UsersRepository>;
  const hashingService = new HashingService();

  const baseProfile: UserProfile = {
    name: 'Test User',
    hcpHistory: [{ date: new Date().toISOString(), hcp: 18 }],
    favoriteCourseIds: [],
    trainingObjective: 'recommended',
  };

  const buildUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-id',
    email: 'test@test.com',
    passwordHash: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: baseProfile,
    ...overrides,
  });

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateProfile: jest.fn(),
      toPublicUser: jest.fn(),
    } as unknown as jest.Mocked<UsersRepository>;

    service = new UsersService(hashingService, repository);
  });

  it('crea un usuario aplicando hash a la contraseña y devuelve la vista pública', async () => {
    repository.findByEmail.mockResolvedValue(undefined);
    const createdUser = buildUser();
    repository.create.mockResolvedValue(createdUser);
    const { passwordHash: _hash, ...publicUser } = createdUser;
    repository.toPublicUser.mockReturnValue(publicUser);

    const result = await service.create('new@test.com', 'password', 'Nuevo Usuario');

    expect(repository.findByEmail).toHaveBeenCalledWith('new@test.com');
    expect(repository.create).toHaveBeenCalledTimes(1);
    const payload = repository.create.mock.calls[0][0];
    expect(payload.email).toBe('new@test.com');
    expect(payload.passwordHash).not.toBe('password');
    expect(repository.toPublicUser).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(publicUser);
  });

  it('impide registrar dos usuarios con el mismo correo', async () => {
    repository.findByEmail.mockResolvedValue(buildUser());

    await expect(service.create('duplicate@test.com', 'password', 'Duplicado')).rejects.toBeInstanceOf(ConflictException);
  });

  it('obtiene un usuario público por id y lanza si no existe', async () => {
    const user = buildUser({ id: 'user-1' });
    const { passwordHash: _hash, ...publicUser } = user;
    repository.findById.mockResolvedValue(user);
    repository.toPublicUser.mockReturnValue(publicUser);

    await expect(service.getPublicUserById('user-1')).resolves.toEqual(publicUser);
    expect(repository.findById).toHaveBeenCalledWith('user-1');

    repository.findById.mockResolvedValue(undefined);
    await expect(service.getPublicUserById('missing')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('actualiza el perfil delegando en el repositorio', async () => {
    const updatedUser = buildUser({
      profile: { ...baseProfile, trainingObjective: 'custom' },
    });
    repository.updateProfile.mockResolvedValue(updatedUser);

    await expect(service.updateProfile('user-id', updatedUser.profile)).resolves.toEqual(updatedUser);
    expect(repository.updateProfile).toHaveBeenCalledWith('user-id', updatedUser.profile);
  });
});

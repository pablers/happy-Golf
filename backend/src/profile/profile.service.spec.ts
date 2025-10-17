import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common';
import { UserProfile } from '../users/user.interface';

describe('ProfileService', () => {
  let service: ProfileService;
  let usersService: { findOneById: jest.Mock; updateProfile: jest.Mock };

  const profile: UserProfile = {
    name: 'Test User',
    hcpHistory: [{ date: '2023-01-01T00:00:00.000Z', hcp: 18 }],
    favoriteCourseIds: ['course-1'],
    trainingObjective: 'improve putting',
  };

  beforeEach(async () => {
    usersService = {
      findOneById: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get(ProfileService);
  });

  it('should return the profile for an existing user', async () => {
    usersService.findOneById.mockResolvedValue({ profile });

    await expect(service.getProfile(1)).resolves.toEqual(profile);
    expect(usersService.findOneById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when the user does not exist', async () => {
    usersService.findOneById.mockResolvedValue(undefined);

    await expect(service.getProfile(99)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should update the profile through the users service', async () => {
    const updatedProfile: UserProfile = { ...profile, trainingObjective: 'break 80' };
    usersService.updateProfile.mockResolvedValue({ profile: updatedProfile });

    await expect(service.updateProfile(1, updatedProfile)).resolves.toEqual(updatedProfile);
    expect(usersService.updateProfile).toHaveBeenCalledWith(1, updatedProfile);
  });
});

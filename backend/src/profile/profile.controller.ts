import { Controller, Get, Put, UseGuards, Request, Body, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/profile.dto';
import { UserProfile } from 'src/users/user.interface';
import { User, HcpRecord as PrismaHcpRecord } from '@prisma/client';

type UserWithHistory = User & { hcpHistory: PrismaHcpRecord[] };

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  private buildProfile(user: UserWithHistory): UserProfile {
    return {
      name: user.name,
      hcpHistory: user.hcpHistory.map(record => ({
        date: record.date.toISOString(),
        hcp: record.hcp,
      })),
      favoriteCourseIds: user.favoriteCourseIds,
      trainingObjective: user.trainingObjective,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req): Promise<UserProfile> {
    // req.user is populated by the JwtStrategy with { userId: number, email: string }
    const user = await this.usersService.findOneById(req.user.userId);
    if (!user) {
        // This case should be rare if token is valid
        throw new NotFoundException('User not found');
    }
    return this.buildProfile(user as UserWithHistory);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto): Promise<UserProfile> {
    const updatedUser = await this.usersService.updateProfile(req.user.userId, updateProfileDto);
    return this.buildProfile(updatedUser as UserWithHistory);
  }
}

import { Controller, Get, Put, UseGuards, Request, Body, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/profile.dto';
import { User } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersService.findOneById(req.user.userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto): Promise<Omit<User, 'passwordHash'>> {
    const updatedUser = await this.usersService.updateProfile(req.user.userId, updateProfileDto);
    const { passwordHash, ...result } = updatedUser;
    return result;
  }
}

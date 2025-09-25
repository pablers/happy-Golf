import { Controller, Get, Put, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    // req.user is populated by the JwtStrategy
    const user = await this.usersService.findOneById(req.user.userId);
    if (!user) {
        // This case should be rare if token is valid
        throw new Error('User not found');
    }
    return user.profile;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const updatedUser = await this.usersService.updateProfile(req.user.userId, updateProfileDto);
    return updatedUser.profile;
  }
}

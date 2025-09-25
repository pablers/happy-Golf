import { Controller, Get, Put, UseGuards, Request, Body, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from './dto/profile.dto';

type UserRecord = { passwordHash?: string } & Record<string, any>;
type PublicUser = Omit<UserRecord, 'passwordHash'>;

@Controller('profile')
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req): Promise<PublicUser> {
    const user = (await this.usersService.findOneById(req.user.userId)) as UserRecord | null;
    if (!user) {
        throw new NotFoundException('User not found');
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto): Promise<PublicUser> {
    const updatedUser = (await this.usersService.updateProfile(req.user.userId, updateProfileDto)) as UserRecord;
    const { passwordHash, ...result } = updatedUser;
    return result;
  }
}

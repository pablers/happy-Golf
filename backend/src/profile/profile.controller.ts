import { Controller, Get, Put, UseGuards, Request, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    // Obtiene el perfil delegando la lógica al servicio de perfiles.
    return this.profileService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    // Actualiza el perfil aplicando validaciones desde el servicio dedicado.
    return this.profileService.updateProfile(req.user.userId, updateProfileDto);
  }
}

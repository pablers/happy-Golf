import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

/**
 * UsersController expone endpoints protegidos para consultar usuarios.
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Devuelve los datos del usuario autenticado sin el hash de contraseña. */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return this.usersService.getPublicUserById(req.user.userId);
  }

  /** Permite consultar cualquier usuario por id, útil para vistas administrativas. */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.usersService.getPublicUserById(id);
  }
}

import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, CompleteProfileDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register')
  signUp(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete-profile')
  async completeProfile(@Request() req: any, @Body() completeProfileDto: CompleteProfileDto) {
    const userId = req.user.userId;
    return this.authService.completeProfile(
      userId,
      completeProfileDto.handicap,
      completeProfileDto.trainingObjective,
      completeProfileDto.favoriteCourseIds
    );
  }
}

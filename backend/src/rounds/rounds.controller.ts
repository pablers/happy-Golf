import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put, ValidationPipe } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRoundDto } from './dto/create-round.dto';
import { Prisma } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  create(@Request() req, @Body(new ValidationPipe()) createRoundDto: CreateRoundDto) {
    const payload = {
      ...createRoundDto,
      date: new Date(createRoundDto.date), // Ensure date is a Date object
      userId: req.user.userId,
    };
    return this.roundsService.createRound(payload);
  }

  @Get()
  findAll(@Request() req) {
    return this.roundsService.getRounds(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roundsService.getRoundById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body(new ValidationPipe()) updateRoundDto: Prisma.RoundUpdateInput) {
    return this.roundsService.updateRound(id, updateRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roundsService.deleteRound(id);
  }
}
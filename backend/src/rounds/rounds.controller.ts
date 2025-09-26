import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rounds')
export class RoundsController {
  constructor(private readonly roundsService: RoundsService) {}

  @Post()
  create(@Request() req, @Body() createRoundDto: any) {
    return this.roundsService.createRound({ ...createRoundDto, userId: req.user.userId });
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
  update(@Param('id') id: string, @Body() updateRoundDto: any) {
    return this.roundsService.updateRound(id, updateRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roundsService.deleteRound(id);
  }
}
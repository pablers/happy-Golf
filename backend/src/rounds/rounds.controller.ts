import { Controller, Post, Body, UseGuards, Request, Get, Param } from '@nestjs/common';
import { RoundsService } from './rounds.service';
import { CreateRoundDto } from './dto/create-round.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('rounds')
export class RoundsController {
    constructor(private readonly roundsService: RoundsService) {}

    @Post()
    create(@Request() req, @Body() createRoundDto: CreateRoundDto) {
        // req.user contains the payload from the JWT, which has the userId
        return this.roundsService.create(req.user.userId, createRoundDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.roundsService.findAllForUser(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        // Note: This doesn't check if the user is authorized to see this round.
        // A real app would add another layer of authorization here.
        return this.roundsService.findOneById(id);
    }
}

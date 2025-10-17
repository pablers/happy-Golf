import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CoreModule } from '../core/core.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

// UsersModule organiza controladores y servicios relacionados con usuarios.
@Module({
  imports: [CoreModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}

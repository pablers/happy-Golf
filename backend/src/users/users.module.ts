import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { CoreModule } from '../core/core.module';

// UsersModule expone UsersService y reutiliza dependencias compartidas.
@Module({
  imports: [CoreModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

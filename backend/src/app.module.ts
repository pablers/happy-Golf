import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { RoundsModule } from './rounds/rounds.module';

// AppModule compone el resto de módulos de dominio y la configuración global.
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    CoreModule,
    AuthModule,
    ProfileModule,
    UsersModule,
    RoundsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
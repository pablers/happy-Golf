import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { UsersModule } from './users/users.module';
import { CoreModule } from './core/core.module';
import { RoundsModule } from './rounds/rounds.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// AppModule compone la configuracin global y los mdulos de dominio disponibles.
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'dist'),
      exclude: ['/api/(.*)'],
    }),
    PrismaModule,
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

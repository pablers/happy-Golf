import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    console.log('--- DEBUG PRE-BOOTSTRAP ---');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    console.log('---------------------------');

    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const port = configService.get('PORT') || 3001;
    let corsOrigin: boolean | string | RegExp | (string | RegExp)[] = configService.get('CORS_ORIGIN');

    // Support comma-separated origins
    if (typeof corsOrigin === 'string' && corsOrigin.includes(',')) {
        corsOrigin = corsOrigin.split(',').map(origin => origin.trim());
    }

    app.enableCors({
        origin: corsOrigin,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    // Set a global prefix for all routes
    app.setGlobalPrefix('api');

    // Use global pipes for validation
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

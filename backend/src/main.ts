import { NestFactory } from '@nestjs/core';
app.setGlobalPrefix('api');

// Use global pipes for validation
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

await app.listen(port);
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './notify.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const port = process.env.PORT || 9041;
  await app.listen(port);
  console.log(`🚀 Notify Service running on port ${port}`);
}

bootstrap();

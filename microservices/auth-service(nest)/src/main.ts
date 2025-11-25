import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionsFilter } from './interceptors/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 9031;
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // config validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // chỉ nhận field có trong DTO
      forbidNonWhitelisted: true, // field lạ sẽ báo lỗi
      transform: true, // tự động chuyển đổi dữ liệu (ví dụ string -> number)
      stopAtFirstError: true, // dừng ngay khi gặp lỗi đầu tiên
    }),
  );

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();

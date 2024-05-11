import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_PORT', 3001);
  const host = configService.get<string>('API_HOST');

  await app.listen(port, () => {
    console.log(`App started on ${host}${port}`);
  });
}
bootstrap();

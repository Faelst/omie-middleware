import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService);

  app.enableCors({
    origin: '*',
  });

  const port = cfg.get<number>('app.port', 3000);
  await app.listen(port);
}
bootstrap();

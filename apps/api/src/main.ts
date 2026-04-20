import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const webOrigin = process.env.WEB_URL ?? 'http://localhost:3000';
  const port = Number(process.env.PORT ?? 3001);
  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();

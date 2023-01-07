import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const file = fs.readFileSync('src/swagger.json');
  const document = JSON.parse(file.toString())
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

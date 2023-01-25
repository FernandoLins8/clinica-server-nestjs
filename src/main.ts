import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.use('/files', express.static('files'));

  const file = fs.readFileSync('src/swagger.json');
  const document = JSON.parse(file.toString())
  SwaggerModule.setup('api', app, document);

  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 3000
  await app.listen(port, host)
}
bootstrap();

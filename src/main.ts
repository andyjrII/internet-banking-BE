import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials:true,            
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    preflightContinue: false,
    maxAge: 86400
  });
  app.setGlobalPrefix('smcbank')
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  app.use(cookieParser());
  await app.listen(3300);
} 
bootstrap();

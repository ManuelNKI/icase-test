import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StoreExceptionFilter } from './store-exception.filter';
const configureHttpSecurity = require('./security/http-security');
async function bootstrap(){const app=await NestFactory.create(AppModule);configureHttpSecurity(app.getHttpAdapter().getInstance());app.useGlobalFilters(new StoreExceptionFilter());await app.listen(Number(process.env.PORT||3000));}
bootstrap();

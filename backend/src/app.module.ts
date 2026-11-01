import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RecordStore } from './record.store';

@Module({
  controllers: [AppController, AuthController],
  providers: [RecordStore, AuthService, { provide: APP_GUARD, useClass: AuthGuard }]
})
export class AppModule {}

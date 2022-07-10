import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TFirebaseConfig } from './config/sections/firebase.config';
import { ValidateEnv } from './config/env.config';
import * as allConfig from './config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate: ValidateEnv,
      load: Object.values(allConfig),
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

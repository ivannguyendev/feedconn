import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ValidateEnv } from './config/env.config';
import * as allConfig from './config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatModule } from './chat.bot/chat.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      validate: ValidateEnv,
      load: Object.values(allConfig),
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
      global: true,
    }), 
    ChatModule,
  ],
})
export class AppModule {}

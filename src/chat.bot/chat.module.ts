import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TestScene } from './test/test.scene';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TFirebaseConfig } from 'src/config/sections/firebase.config';
import * as admin from 'firebase-admin';
import { FirebaseModule } from '@common/firebase';

@Module({
  imports: [
    FirebaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (confService: ConfigService) => {
        const config: TFirebaseConfig = confService.get('firebase');
        return {
          app: config.app,
          credential: admin.credential.cert(config.credential),
          databaseURL: config.databaseURL || undefined,
        };
      },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, TestScene],
})
export class ChatModule {}

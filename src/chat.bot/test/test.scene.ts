import { Debug } from '@common/utils';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatService } from '../chat.service';
import { Template } from './test.template';

@Injectable()
export class TestScene {
  private debug = Debug('AppService');
  constructor(private readonly service: ChatService) {}

  @OnEvent(`${TestScene.name}.start`, {
    async: true,
    promisify: true,
    objectify: true,
  })
  async start(payload, options) {
    const messagePayload = Template.start(payload);
    const sendResult = await this.service.send(payload.userId, messagePayload);
    this.debug('start', sendResult);
    return sendResult;
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post('scene/:scene/start')
  async startScene(
    @Param('scene') scene,
    @Body() body: { payload; options? },
  ) {
    let itemData = await this.service.call(
      scene,
      'start',
      body.payload,
      body.options,
    );
    return itemData;
  }

  @Post('scene/:scene/:method')
  async sendMessage(
    @Param('scene') scene,
    @Param('method') method,
    @Body() body: { payload; options? },
  ) {
    let itemData = await this.service.call(
      scene,
      method,
      body.payload,
      body.options,
    );
    return itemData;
  }
}

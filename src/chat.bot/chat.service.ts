import { FeedconnBuilder } from '@common/feedconn-builder/builder';
import { Message } from '@common/feedconn-builder/models/message.model';
import { FirebaseService } from '@common/firebase';
import { Debug } from '@common/utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  private debug = Debug('AppService');
  constructor(
    private readonly eventEmitter: EventEmitter2,
    readonly firebaseService: FirebaseService,
  ) {}
  /**
   * Ref: https://core.telegram.org/methods
   *
   * @param {string} scene
   * @param {keyof Telegram} method
   * @param {Opts<keyof Telegram>} payload
   * @param {Partial<{ signal }>} [options={}]
   * @return {*}
   * @memberof PrescriptionDeliveryService
   */
  public async call(
    scene: string,
    method: 'start' | string,
    payload: Message,
    options: Partial<{ signal }> = {},
  ) {
    payload = payload;
    const result = await this.eventEmitter.emitAsync(
      `${scene}.${method}`,
      payload,
      options,
    );
    return result;
  }

  async send(userId, message) {
    const db = this.firebaseService.database;
    const payload = FeedconnBuilder.render(message);
    const messageRef = db.ref('messages').child(userId);
    return messageRef.child(String(payload._id)).set(payload);
  }
}

import { Debug } from '@common/utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private debug = Debug('AppService');

  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}

import { FeedconnConfig } from './config';
import * as admin from 'firebase-admin';
import { FeedconnBuilder } from './builder/builder';
import { Message } from './builder';

export class Feedconn {
  private adminApp: admin.app.App;
  constructor(app?: admin.app.App) {
    if (app) {
      this.adminApp = app;
    }
  }

  private assert() {
    if (!this.adminApp) {
      throw new Error('Firebase instance is undefined.');
    }
  }

  loadByConfig(config: FeedconnConfig) {
    if (!config) throw new Error('Missing config args');
    this.adminApp = admin.initializeApp(
      {
        credential: admin.credential.cert(config.credential),
        databaseURL: config.databaseURL,
      },
      config.app,
    );
    return this;
  }

  get database() {
    this.assert();
    return this.adminApp.database();
  }

  async send(userId, message: Partial<Message>) {
    const db = this.database;
    const payload = FeedconnBuilder.render({ ...message, userId });
    const messageRef = db.ref('messages').child(userId);
    await messageRef.child(String(payload._id)).set(payload);
    return payload;
  }
}

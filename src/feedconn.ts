import { FeedconnConfig } from './config';
import * as admin from 'firebase-admin';
import { FeedconnBuilder } from './builder/builder';

export class Feedconn {
  private adminApp: admin.app.App;
  constructor(config: FeedconnConfig) {
    if (config) {
      this.adminApp = admin.initializeApp(config, config.app);
    }
  }

  loadApp(config: FeedconnConfig) {
    if (!config) throw new Error('Missing config args');
    this.adminApp = admin.initializeApp(config, config.app);
    return this.adminApp;
  }

  assert() {
    if (!this.adminApp) {
      throw new Error('Firebase instance is undefined.');
    }
  }

  get database() {
    this.assert();
    return this.adminApp.database();
  }

  async send(userId, message) {
    const db = this.database;
    const payload = FeedconnBuilder.render(message);
    const messageRef = db.ref('messages').child(userId);
    return messageRef.child(String(payload._id)).set(payload);
  }
}

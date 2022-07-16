import { FeedconnConfig } from './config';
import * as admin from 'firebase-admin';

export class Base {
  protected adminApp: admin.app.App;

  constructor(app?: admin.app.App) {
    if (app) {
      this.adminApp = app;
    }
  }

  assert() {
    if (!this.adminApp) {
      throw new Error('Firebase instance is undefined.');
    }
  }

  loadConfig(config: FeedconnConfig) {
    if (!config) throw new Error('Missing config args');
    this.adminApp = admin.initializeApp(
      {
        credential: config.credential?.privateKey
          ? admin.credential.cert(config.credential)
          : admin.credential.applicationDefault(),
        databaseURL: config.databaseURL,
      },
      config.app,
    );
    return this;
  }

  get auth() {
    this.assert();
    return this.adminApp.auth();
  }

  get database() {
    this.assert();
    return this.adminApp.database();
  }

  createCustomToken(uid, claims) {
    if (!uid) throw new Error('Missing uid params');
    return this.auth.createCustomToken(uid, claims);
  }
}

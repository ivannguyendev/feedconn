import { FeedconnConfig } from './config';
import * as admin from 'firebase-admin';
import { Reference } from '@firebase/database-types';
import { Message, FeedBuilder } from '@whthduck/feed-builder';
import { Debug } from './utils';

const debug = Debug('Feedconn');

export class TimeFeedDto {
  path: string;
  createdAt: number;
  feedId?: string;
}

export class Feedconn {
  protected adminApp: admin.app.App;
  feedRef: Reference;
  timefeedRef: Reference;
  tagfeedRef: Reference;
  logfeedRef: Reference;

  constructor(app?: admin.app.App) {
    if (app) {
      this.adminApp = app;
      this.loadRef();
    }
  }

  protected assert() {
    if (!this.adminApp) {
      throw new Error('Firebase instance is undefined.');
    }
  }
  protected loadRef() {
    this.feedRef = this.database.ref('feeds');
    this.timefeedRef = this.database.ref('time-feeds');
    this.tagfeedRef = this.database.ref('tag-feeds');
    this.logfeedRef = this.database.ref('log-feeds');
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
    this.loadRef();
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

  async setLog(ref: string, feedId: string, path: string) {
    const logId = `${ref}/${feedId}`;
    await this.logfeedRef.child(logId).set({
      ref,
      path,
    });
  }

  async getLog(ref: string, feedId: string): Promise<{ ref; path }> {
    const logId = `${ref}/${feedId}`;
    const snapshot = await this.logfeedRef.child(logId).get();
    return snapshot.val();
  }

  async removeLog(ref: string, feedId: string) {
    const logId = `${ref}/${feedId}`;
    await this.logfeedRef.child(logId).remove();
  }

  async setTag(userId: string, key: string, feedId: string) {
    const path = `${userId}/${key}/${feedId}`;
    await this.tagfeedRef.child(path).set(true);
    await this.setLog(this.tagfeedRef.key, feedId + key, path);
    return;
  }

  async removeTag(feedId: string, key: string = '') {
    await this.logfeedRef
      .child(this.tagfeedRef.key)
      .orderByKey()
      .startAt(feedId + key)
      .once(
        'value',
        (snapshot) => {
          snapshot.forEach((data) => {
            const logData = data.val();
            this.tagfeedRef
              .child(logData.path)
              .remove()
              .then(() => {
                this.removeLog(this.timefeedRef.key, data.key);
              });
          });
        },
        (err) => {
          debug.log('removeTag error', err);
        },
      );
  }

  async setTime(userId: string, feedId: string, time: number | Date) {
    const path = `${feedId}`;
    const timeFeed = {
      path: `${userId}/${feedId}`,
      createdAt: new Date(time).getSeconds(),
    };
    await this.timefeedRef.child(feedId).set(timeFeed);
    await this.setLog(this.timefeedRef.key, feedId, path);
  }

  async removeTime(feedId: string) {
    const logData = await this.getLog(this.timefeedRef.key, feedId);
    await this.timefeedRef.child(logData.path).remove();
    await this.removeLog(this.timefeedRef.key, feedId);
  }

  async sendFeed(userId: string, message: Partial<Message>) {
    const payload = FeedBuilder.render({ ...message, userId });
    const feedId = payload._id;
    const path = `${userId}/${feedId}`;
    await this.feedRef.child(path).set(payload);
    await this.setLog(this.feedRef.key, feedId, path);
    return payload;
  }

  async removeFeed(feedId: string) {
    const logData = await this.getLog(this.feedRef.key, feedId);
    await this.feedRef.child(logData.path).remove();
    await this.removeLog(this.feedRef.key, feedId);
  }

  async setReadFeed(feedId: string) {
    const logData = await this.getLog(this.feedRef.key, feedId);
    await this.feedRef.child(logData.path).child('state').set('read');
    await this.removeTag(feedId, 'unread');
    return true;
  }

  async setReadUser(userId: string, key: string) {
    return await this.tagfeedRef
      .child(userId)
      .child(key)
      .once('value', (snapshot) => {
        snapshot.forEach((data) => {
          this.setReadFeed(data.key);
        });
      });
  }

  async send(userId, message: Partial<Message>) {
    const feedPayload = await this.sendFeed(userId, message);
    const feedId = feedPayload._id;

    await this.setTime(userId, feedId, Date.now());
    await this.setTag(userId, 'unread', feedId);
    feedPayload.tags.forEach(async (key) => {
      await this.setTag(userId, key, feedId);
    });

    return feedPayload;
  }

  async remove(feedId: string) {
    await this.removeFeed(feedId);
    await this.removeTime(feedId);
    await this.removeTag(feedId);
  }

  prune(options: { minDate: Date | number }, callback: (err, data) => void) {
    const minSec =
      options.minDate instanceof Date
        ? options.minDate.getSeconds()
        : options.minDate;

    this.timefeedRef
      .orderByChild('createdAt')
      .endAt(minSec)
      .limitToFirst(100)
      .once('value', (snapshot) => {
        snapshot.forEach((data) => {
          this.remove(data.key);
        });
      });
  }
}

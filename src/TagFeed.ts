import * as admin from 'firebase-admin';
import { Reference, DataSnapshot } from '@firebase/database-types';
import { Base } from './Base';
import { LogFeed } from './LogFeed';

export class TagFeed extends Base {
  tagfeedRef: Reference;
  logFeed: LogFeed;

  constructor(app?: admin.app.App) {
    super(app);
    this.tagfeedRef = this.database.ref('tag-feeds');
    this.logFeed = new LogFeed(app);
  }

  async add(userId: string, feedId: string, key: string) {
    const path = `${userId}/${key}/${feedId}`;
    await this.tagfeedRef.child(path).set(true);
    await this.logFeed.add(this.tagfeedRef.key, userId, feedId + key, path);
  }

  async remove(userId: string, feedId: string, key: string) {
    key = key || ''
    const snapshot = await this.logFeed.searchByKey(
      this.tagfeedRef.key,
      userId,
      feedId + key,
    );

    snapshot.forEach((data) => {
      const logData = data.val();
      this.tagfeedRef
        .child(logData.path)
        .remove()
        .then(() => this.logFeed.remove(this.tagfeedRef.key, userId, data.key));
    });
  }

  async searchByKey(
    userId: string,
    key: string,
    callback?: (err, snapshot: DataSnapshot) => void,
  ) {
    const datastream = await this.tagfeedRef.child(userId).child(key);

    if (typeof callback === 'function') {
      datastream.once(
        'value',
        (snapshot) => {
          callback(null, snapshot);
        },
        (err) => {
          callback(err, null);
        },
      );
    } else {
      return datastream.once('value');
    }
  }
}

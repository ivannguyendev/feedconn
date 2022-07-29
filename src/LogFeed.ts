import * as admin from 'firebase-admin';
import { Reference, DataSnapshot } from '@firebase/database-types';
import { Base } from './Base';

export class LogFeed extends Base {
  logfeedRef: Reference;

  constructor(app?: admin.app.App) {
    super(app);
    this.logfeedRef = this.database.ref('log-feeds');
  }

  async add(ref: string, userId: string, feedId: string, path: string) {
    const logId = `${ref}/${userId}/${feedId}`;
    await this.logfeedRef.child(logId).set({
      ref,
      path,
    });
  }

  async find(
    ref: string,
    userId: string,
    feedId: string,
  ): Promise<{ ref; path }> {
    const logId = `${ref}/${userId}/${feedId}`;
    const snapshot = await this.logfeedRef.child(logId).get();
    return snapshot.val();
  }

  async remove(ref: string, userId: string, feedId: string) {
    const logId = `${ref}/${userId}/${feedId}`;
    await this.logfeedRef.child(logId).remove();
  }

  async searchByKey(
    ref: string,
    userId: string,
    key: string = '',
    callback?: (err, snapshot: DataSnapshot) => void,
  ) {
    const datastream = await this.logfeedRef
      .child(ref)
      .child(userId)
      .orderByKey()
      .equalTo(key);

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

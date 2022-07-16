import * as admin from 'firebase-admin';
import { Reference, DataSnapshot } from '@firebase/database-types';
import { Base } from './Base';

export class LogFeed extends Base {
  logfeedRef: Reference;

  constructor(app?: admin.app.App) {
    super(app);
    this.logfeedRef = this.database.ref('log-feeds');
  }

  async add(ref: string, feedId: string, path: string) {
    const logId = `${ref}/${feedId}`;
    await this.logfeedRef.child(logId).set({
      ref,
      path,
    });
  }

  async find(ref: string, feedId: string): Promise<{ ref; path }> {
    const logId = `${ref}/${feedId}`;
    const snapshot = await this.logfeedRef.child(logId).get();
    return snapshot.val();
  }

  async remove(ref: string, feedId: string) {
    const logId = `${ref}/${feedId}`;
    await this.logfeedRef.child(logId).remove();
  }

  async searchByKey(
    ref: string,
    key: string = '',
    callback?: (err, snapshot: DataSnapshot) => void,
  ) {
    const datastream = await this.logfeedRef
      .child(ref)
      .orderByKey()
      .startAt(key);

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

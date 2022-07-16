import * as admin from 'firebase-admin';
import { Reference, DataSnapshot } from '@firebase/database-types';
import { Base } from './Base';
import { LogFeed } from './LogFeed';

export class TimeFeedDto {
  path: string;
  createdAt: number;
  feedId?: string;
}

export class TimeFeed extends Base {
  timefeedRef: Reference;
  logFeed: LogFeed;

  constructor(app?: admin.app.App) {
    super(app);
    this.timefeedRef = this.database.ref('time-feeds');
    this.logFeed = new LogFeed(app);
  }

  async add(userId: string, feedId: string, time: number | Date) {
    const timeFeed = {
      path: `${userId}/${feedId}`,
      createdAt: Math.floor(new Date(time).getTime() / 1000),
    };
    await this.timefeedRef.child(feedId).set(timeFeed);
    await this.logFeed.add(this.timefeedRef.key, feedId, feedId);
  }

  async remove(feedId: string) {
    const logData = await this.logFeed.find(this.timefeedRef.key, feedId);
    await this.timefeedRef.child(logData.path).remove();
    await this.logFeed.remove(this.timefeedRef.key, feedId);
  }

  async searchOldFeed(
    options: { minDate: Date | number },
    callback?: (err, snapshot: DataSnapshot) => void,
  ) {
    const minSec =
      options.minDate instanceof Date
        ? Math.floor(options.minDate.getTime() / 1000)
        : Math.floor(Number(options.minDate) / 1000);

    const datastream = await this.timefeedRef
      .orderByChild('createdAt')
      .endAt(minSec)
      .limitToFirst(100);

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

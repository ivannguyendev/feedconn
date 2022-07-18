import * as admin from 'firebase-admin';
import { Reference } from '@firebase/database-types';
import { Message, FeedBuilder } from '@whthduck/feed-builder';
import { Base } from './Base';
import { LogFeed } from './LogFeed';
import { TagFeed } from './TagFeed';

export class Feed extends Base {
  feedRef: Reference;
  logFeed: LogFeed;
  tagFeed: TagFeed;

  constructor(app?: admin.app.App) {
    super(app);
    this.feedRef = this.database.ref('feeds');
    this.logFeed = new LogFeed(app);
    this.tagFeed = new TagFeed(app);
  }

  async countFeed(path: string) {
    const snapshot = await this.feedRef.child(path).child('count').get();
    return snapshot.val() || 0;
  }

  async add(userId: string, message: Partial<Message>) {
    const feedMessage = FeedBuilder.render({ ...message, userId });
    const feedId = feedMessage._id;
    const path = `${userId}/${feedId}`;
    const countFeed = await this.countFeed(path);
    feedMessage.count += countFeed;
    await this.feedRef.child(path).set(feedMessage);
    await this.logFeed.add(this.feedRef.key, feedId, path);
    return feedMessage;
  }

  async remove(feedId: string) {
    const logData = await this.logFeed.find(this.feedRef.key, feedId);
    await this.feedRef.child(logData.path).remove();
    await this.logFeed.remove(this.feedRef.key, feedId);
  }

  async setReadState(feedId: string) {
    const logData = await this.logFeed.find(this.feedRef.key, feedId);
    await this.feedRef.child(logData.path).update({
      state: 'read',
    });
    await this.tagFeed.remove(feedId, 'unread');
    return true;
  }
}

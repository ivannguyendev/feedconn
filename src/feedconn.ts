import { FeedconnConfig } from './config';
import * as admin from 'firebase-admin';
import { Message } from '@whthduck/feed-builder';
import { Feed } from './Feed';
import { TimeFeed } from './TimeFeed';
import { TagFeed } from './TagFeed';
import { LogFeed } from './LogFeed';
import { Base } from './Base';
import { Debug } from './utils';

const debug = Debug('Feedconn');

export class Feedconn extends Base {
  feeds: Feed;
  timeFeeds: TimeFeed;
  tagFeeds: TagFeed;
  logFeeds: LogFeed;

  constructor(app?: admin.app.App) {
    super(app);
    if (app) {
      this.adminApp = app;
      this.boostrap();
    }
  }

  protected boostrap() {
    this.feeds = new Feed(this.adminApp);
    this.timeFeeds = new TimeFeed(this.adminApp);
    this.tagFeeds = new TagFeed(this.adminApp);
    this.logFeeds = new LogFeed(this.adminApp);
    this.database
      .getRulesJSON()
      .then((ruleConfig: { rules }) => {
        const rules = ruleConfig.rules || {};
        rules.feeds = {
          $userId: {
            '.read': '$userId === auth.uid',
            '.write': '$userId === auth.uid',
            '.indexOn': 'state',
          },
        };
        rules['time-feeds'] = {
          '.indexOn': 'createdAt',
          '.write': true,
          '.read': true,
        };
        rules['tag-feeds'] = {
          $userId: {
            '.read': '$userId === auth.uid',
            '.write': '$userId === auth.uid',
            '.indexOn': '.value',
          },
        };
        rules['log-feeds'] = {
          '.write': false,
          '.read': false,
        };
        return this.database.setRules({ rules: rules });
      })
      .then(() => {
        debug('load rules');
      })
      .catch((err) => {
        debug(err);
      });
  }

  loadConfig(config: FeedconnConfig) {
    super.loadConfig(config);
    this.boostrap();
    return this;
  }

  async setAllRead(userId: string) {
    const snapshot = await this.tagFeeds.searchByKey(userId, 'unread');
    snapshot.forEach((data) => {
      this.feeds.setReadState(userId, data.key);
    });
  }

  async send(userId, message: Partial<Message>) {
    const feedMessage = await this.feeds.add(userId, message);
    const feedId = feedMessage._id;

    await this.timeFeeds.add(userId, feedId, Date.now());
    await this.tagFeeds.add(userId, feedId, 'unread');

    feedMessage.tags.forEach(async (key) => {
      await this.tagFeeds.add(userId, feedId, key);
    });

    return feedMessage;
  }

  async remove(userId: string, feedId: string) {
    await this.feeds.remove(userId, feedId);
    await this.timeFeeds.remove(userId, feedId);
    await this.tagFeeds.remove(userId, feedId);
  }

  async prune(options: { minDate: Date | number }) {
    const snapshot = await this.timeFeeds.searchOldFeed(options);
    snapshot.forEach((dataSnapshot) => {
      const data = dataSnapshot.val();
      this.remove(data.userId, data.feedId);
    });
  }
}

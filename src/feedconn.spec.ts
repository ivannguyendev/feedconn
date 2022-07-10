import test, { ExecutionContext } from 'ava';
import * as feedconn from './feedconn';
import * as credential from './cert/cert.json';
import * as database from './cert/database.json';

test.before('Init feedconn app', (t: ExecutionContext<any>) => {
  const feedconnApp = new feedconn.Feedconn().loadByConfig({
    app: 'app',
    credential: {
      ...credential,
      projectId: credential['projectId'] || credential.project_id,
      privateKey: credential['privateKey'] || credential.private_key,
      clientEmail: credential['clientEmail'] || credential.client_email,
    },
    databaseURL: database.url,
  });
  t.context.feedconnApp = feedconnApp;
});

test(`${feedconn.Feedconn.name} send success`, async (t: ExecutionContext<any>) => {
  const feedconnApp = t.context.feedconnApp;

  const messageResult = await feedconnApp.send('whthduck', {
    headings: {
      all: 'Hi, whthduck!',
    },
    contents: {
      all: 'Hi, whthduck!',
    },
    collapse: 'test',
    userId: 'whthduck',
  });

  t.is(messageResult.headings.all, 'Hi, whthduck!', 'send success');
});

test(`${feedconn.Feedconn.name} wrong types model`, async (t: ExecutionContext<any>) => {
  const feedconnApp = t.context.feedconnApp;
  try {
    const messageResult = await feedconnApp.send('whthduck', {
      tags: 'unread',
    });
    t.is(messageResult, 'Hi, whthduck!', 'send success');
  } catch (err) {
    t.not(err, null, 'wrong message model');
  }
});

// test(`${flaword.Flaword.check.name} detect sleep syntax`, (t) => {
//   const flawCheck = flaword.Flaword.check({
//     fields: "_id",
//     populate: ";+sleep(3000);+var+x=",
//     filter: {},
//     sort: "-updatedAt",
//     skip: 0,
//     limit: 1,
//   });
//   t.is(flawCheck.isFlaw, true);
//   t.is(flawCheck.key, "populate");
// });

// test(`${flaword.Flaword.check.name} fresh request`, (t) => {
//   const flawCheck = flaword.Flaword.check({
//     fields: "_id",
//     populate: "",
//     filter: {},
//     sort: "-updatedAt",
//     skip: 0,
//     limit: 1,
//   });
//   t.is(flawCheck.isFlaw, false);
// });

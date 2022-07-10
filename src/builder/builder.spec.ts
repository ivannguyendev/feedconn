import test from 'ava';
import * as builder from './builder';

test(`${builder.FeedconnBuilder.name} default message`, (t) => {
  const messagePayload = builder.FeedconnBuilder.render({
    contents: {
      all: 'Hello2',
    },
    headings: {
      all: 'Xin chào2',
    },
    state: 'unread',
    tags: ['test'],
    collapse: 'test',
    userId: 'whthduck',
  });
  t.is(messagePayload.contents.all, 'Hello2', 'default contents of message');
  t.is(messagePayload.state, 'unread', 'default state message');
  t.is(messagePayload.tags[0], 'test', 'with tags');
});

test(`${builder.FeedconnBuilder.name} data message`, (t) => {
  const messagePayload = builder.FeedconnBuilder.render({
    contents: {
      all: 'Hello2',
    },
    headings: {
      all: 'Xin chào2',
    },
    state: 'unread',
    tags: ['test'],
    collapse: 'test',
    userId: 'whthduck',
    data: {
      test: true,
    },
  });
  t.not(messagePayload.data, null, 'data fields not null');
  t.not(messagePayload.data, undefined, 'data fields not undefined');
  t.is(typeof messagePayload.data, 'object', 'data fields is object');
});

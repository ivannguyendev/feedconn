import { Message } from '@common/feedconn-builder';
import { StringCode } from '@common/utils';

export const Template = {
  start: (payload: { userId; heading; content }) => ({
    headings: {
      all: payload.heading,
    },
    contents: {
      all: payload.content,
    },
    tags: ['test'],
  }),
};

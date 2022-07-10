import { AppOptions } from 'firebase-admin';

export type FeedconnConfig = AppOptions & {
  app: string;
};
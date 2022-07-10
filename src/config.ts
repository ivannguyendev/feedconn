import { AppOptions, ServiceAccount } from 'firebase-admin';

export type FeedconnConfig = Omit<AppOptions, 'credential'> & {
  app: string;
  credential: string | ServiceAccount;
};

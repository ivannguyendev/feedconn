import { registerAs } from '@nestjs/config';
import { AppOptions } from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin/app';

export type TFirebaseConfig = AppOptions & {
  app: string;
  credential: ServiceAccount;
};

export default registerAs('firebase', (): TFirebaseConfig => {
  const credential = require(process.env.FIREBASE_CERT_PATH);
  return {
    app: 'app',
    credential: credential,
  };
});

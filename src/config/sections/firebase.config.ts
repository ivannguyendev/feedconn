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
    credential: {
      ...credential,
      projectId: credential.projectId || credential.project_id,
      privateKey: credential.privateKey || credential.private_key,
      privateKeyId: credential.privateKeyId || credential.private_key_id,
      clientEmail: credential.clientEmail || credential.client_email,
      clientId: credential.clientId || credential.client_id,
      authUri: credential.authUri || credential.auth_uri,
      tokenUri: credential.tokenUri || credential.token_uri,
      authProviderX509CertUrl:
        credential.authProviderX509CertUrl ||
        credential.auth_provider_x509_cert_url,
      clientX509CertUrl:
        credential.clientX509CertUrl || credential.client_x509_cert_url,
    },
    databaseURL: process.env.FIREBASE_DATABASE_URL
  };
});

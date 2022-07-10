import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_PROVIDE_KEY } from './constants';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject(FIREBASE_PROVIDE_KEY) private readonly app: admin.app.App,
  ) {}

  assert() {
    if (!this.app) {
      throw new Error('Firebase instance is undefined.');
    }
  }

  get firestore() {
    this.assert();
    return this.app.firestore();
  }
  get auth() {
    this.assert();
    return this.app.auth();
  }
  get database() {
    this.assert();
    return this.app.database();
  }
  get messaging() {
    this.assert();
    return this.app.messaging();
  }
  get remoteConfig() {
    this.assert();
    return this.app.remoteConfig();
  }
  get storage() {
    this.assert();
    return this.app.storage();
  }
}

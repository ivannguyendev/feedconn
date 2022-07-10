import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_CONF_KEY, FIREBASE_PROVIDE_KEY } from './constants';
import { FirebaseService } from './firebase.service';

export type FirebaseOptions = admin.AppOptions & {
  app: string;
};

export interface FirebaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<FirebaseOptions> | FirebaseOptions;
  inject?: any[];
}

@Module({})
export class FirebaseModule {
  static forRootAsync(options: FirebaseModuleAsyncOptions): DynamicModule {
    const ConfigProvide = {
      provide: FIREBASE_CONF_KEY,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    const FirebaseProvide = {
      provide: FIREBASE_PROVIDE_KEY,
      useFactory: (option: FirebaseOptions) => {
        const app = admin.initializeApp(option, option.app);
        return app;
      },
      inject: [FIREBASE_CONF_KEY],
    };

    return {
      module: FirebaseModule,
      imports: options.imports,
      providers: [ConfigProvide, FirebaseProvide, FirebaseService],
      exports: [FirebaseService],
    };
  }
}

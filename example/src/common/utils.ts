import { debug as DebugClass } from 'debug';
export const Debug = (nsp: string = 'app') => DebugClass(`feedconn:${nsp}`);

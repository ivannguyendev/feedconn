import DebugClass from 'debug';

export const Debug = (nsp: string = 'app') => {
  const debug = DebugClass(`feedconn:${nsp}`)
  debug.enabled = true
  return debug
};

export class StringCode {
    static encode(...args: any[]) {
      return args.join(':');
    }
  
    static decode(str: string): string[];
    static decode(str: string, index: number): string;
    static decode(str: string, index?: number) {
      const args = str.split(':');
      return typeof index === 'number' ? args[index] : args;
    }
  }
  
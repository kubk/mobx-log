import { getStoreName } from './store';
import { useEffect } from 'react';
import { makeLoggable } from './make-loggable';

export const useMakeLoggable = (store: any, name?: string) => {
  useEffect(() => {
    if (!getStoreName(store)) {
      if (name) {
        (store as any).loggableName = name;
      } else {
        throw new Error(
          'Unable to get store name. If you passed plain object to useMakeLoggable please add `loggableName` property'
        );
      }
    }
    makeLoggable(store);
  }, []);
};

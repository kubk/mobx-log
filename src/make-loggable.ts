import { SpyListener } from './spy-listener';
import { config } from './config';
import {
  ArrayFormatter,
  ChromeFormatter,
  MapFormatter,
  ObjectFormatter,
  SetFormatter,
} from './chrome-formatters';
import { getStoreName } from './store';
import { isObservable } from 'mobx';

declare global {
  interface Window {
    devtoolsFormatters: ChromeFormatter<any>[];
    store?: Record<string, object | Array<object>>;
  }
}

let spyListener: SpyListener;

const firstLetterLowerCase = (word: string) => {
  return word.charAt(0).toLowerCase() + word.slice(1);
};

export const makeLoggable = <T extends {}>(store: T): T => {
  if (process.env.NODE_ENV === 'production') {
    return store;
  }

  if (!isObservable(store)) {
    throw new Error(
      'mobx-log: store is not observable: ' +
        JSON.stringify(store, null, 2) +
        '. Make sure you called makeAutoObservable/makeObservable before calling makeLoggable'
    );
  }

  if (!spyListener) {
    spyListener = new SpyListener(config.logger, config.debug, config.filters);
    spyListener.listen();

    const isBrowser = typeof window !== 'undefined';
    if (isBrowser) {
      window.devtoolsFormatters = window.devtoolsFormatters || [];
      window.devtoolsFormatters.push(
        new ArrayFormatter(),
        new ObjectFormatter(),
        new MapFormatter(),
        new SetFormatter()
      );
    }
  }

  const storeName = getStoreName(store);
  if (storeName === null) {
    return store;
  }

  if (config.storeConsoleAccess) {
    window.store = window.store || {};
    const storeKey = firstLetterLowerCase(storeName);
    window.store[storeKey] = store;
  }

  spyListener.addFilterByStoreName(storeName);

  return store;
};

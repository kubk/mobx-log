import { SpyListener } from './spy-listener';
import { config } from './config';
import {
  ArrayFormatter,
  ChromeFormatter,
  MapFormatter,
  ObjectFormatter,
  SetFormatter,
} from './chrome-formatters';

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

export const makeLoggable = (store: Object) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (!spyListener) {
    spyListener = new SpyListener(config.logger, config.debug);
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

  const storeName = store.constructor.name;

  if (config.storeConsoleAccess) {
    if (window.store === undefined) {
      window.store = {};
    }
    const storeKey = firstLetterLowerCase(storeName);
    if (window.store[storeKey] === undefined) {
      window.store[storeKey] = store;
    } else {
      // If the key is not empty there is already a store with the same name added to window object
      // Let's turn it into an array of stores to not lose any store
      if (!Array.isArray(window.store[storeKey])) {
        window.store[storeKey] = [window.store[storeKey]];
      }
      const storeList = window.store[storeKey];
      if (!Array.isArray(storeList)) {
        throw new Error(
          'TypeScript check. Should not be reached. Please file an issue if you encounter this'
        );
      }
      storeList.push(store);
    }
  }

  spyListener.addFilterByStoreName(storeName);
};

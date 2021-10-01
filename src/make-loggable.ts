import { SpyListener } from './spy-listener';
import { config } from './config';
import {
  ArrayFormatter,
  ChromeFormatter,
  ObjectFormatter,
} from './chrome-formatters';

declare global {
  interface Window {
    devtoolsFormatters: ChromeFormatter<any>[];
    store: Record<string, object>;
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
        new ObjectFormatter()
      );
    }
  }

  const storeName = store.constructor.name;

  if (config.storeConsoleAccess) {
    if (!window.store) {
      window.store = {};
    }
    window.store[firstLetterLowerCase(storeName)] = store;
  }

  spyListener.addFilterByStoreName(storeName);
};

import {
  BrowserConsoleSpy,
  StoreEventFilters,
} from './browser-logger/browser-console-spy';
import { config, LoggerType } from './config';
import {
  installMobxFormatters,
  ChromeFormatter,
} from './browser-logger/chrome-formatters';
import { getStoreName } from './store';
import { isObservable } from 'mobx';
import { UnreachableCaseError } from './lib/unreachable-case/unreachable-case';
import {
  addStoreToDevtools,
  isReduxDevtoolsAvailable,
} from './redux-devtools/mobx-redux-devtools';

declare global {
  interface Window {
    devtoolsFormatters: ChromeFormatter<any>[];
    store?: Record<string, object | Array<object>>;
  }
}

let browserConsoleSpy: BrowserConsoleSpy;

const firstLetterLowerCase = (word: string) => {
  return word.charAt(0).toLowerCase() + word.slice(1);
};

type PerStoreFilters = {
  filters: { events: StoreEventFilters };
};

export const makeLoggable = <T extends {}>(
  store: T,
  perStoreConfig?: PerStoreFilters
): T => {
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

  if (config.type === null) {
    throw new Error(`mobx-log: using mobx-log without an initializer function is deprecated.
Please call configureLogger or configureDevtools in the very beginning of your code.
    `);
  }

  const storeName = getStoreName(store);
  if (storeName === null) {
    return store;
  }

  switch (config.type) {
    case LoggerType.ReduxDevtools:
      if (!isReduxDevtoolsAvailable) {
        throw new Error(
          `mobx-log: it looks like redux-devtools are not installed. Please install them to proceed.`
        );
      }
      addStoreToDevtools(store);
      break;
    case LoggerType.BrowserConsole: {
      if (!browserConsoleSpy) {
        browserConsoleSpy = new BrowserConsoleSpy(
          config.logger,
          config.debug,
          config.filters
        );
        browserConsoleSpy.listen();
        installMobxFormatters();
      }

      const actualPerStoreConfig = Object.assign(
        {
          filters: {
            events: {
              computeds: true,
              actions: true,
              observables: true,
            },
          },
        },
        perStoreConfig
      );

      browserConsoleSpy.addFilterByStore(
        storeName,
        actualPerStoreConfig.filters.events
      );
      break;
    }
    default:
      throw new UnreachableCaseError(config.type);
  }

  if (config.storeConsoleAccess) {
    window.store = window.store || {};
    const storeKey = firstLetterLowerCase(storeName);
    window.store[storeKey] = store;
  }

  return store;
};

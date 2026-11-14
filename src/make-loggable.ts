import {
  BrowserConsoleSpy,
  StoreEventFilters,
} from './browser-logger/browser-console-spy';
import { config, LoggerType } from './config';
import {
  ChromeFormatter,
  installMobxFormatters,
} from './browser-logger/chrome-formatters';
import { getStoreName } from './store';
import { isObservable } from 'mobx';
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

type PerStoreFilters = {
  filters: { events: StoreEventFilters };
};

export const makeLoggable = <T extends {}>(
  store: T,
  perStoreConfig?: PerStoreFilters
): T => {
  // Dev-only code must stay inside this branch: bundlers drop a branch whose
  // condition is statically false, but esbuild keeps code after an early return.
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    logStore(store, perStoreConfig);
  }
  return store;
};

const logStore = (store: {}, perStoreConfig?: PerStoreFilters) => {
  if (!isObservable(store)) {
    throw new Error(
      'mobx-log: store is not observable: ' +
        JSON.stringify(store, null, 2) +
        '. Make sure you called makeAutoObservable/makeObservable before calling makeLoggable'
    );
  }

  const loggerType: LoggerType | null = isReduxDevtoolsAvailable()
    ? 'redux-devtools'
    : config.browserConsoleFallback
      ? 'browser-console'
      : null;

  const storeName = getStoreName(store);
  if (storeName === null) {
    return;
  }

  switch (loggerType) {
    case null:
      // Redux devtools are not installed and the browser console fallback is
      // disabled - skip logging entirely to avoid noise in the console.
      break;
    case 'redux-devtools':
      addStoreToDevtools(store);
      break;
    case 'browser-console': {
      if (!browserConsoleSpy) {
        browserConsoleSpy = new BrowserConsoleSpy(
          config.logger,
          config.debug,
          config.filters
        );
        browserConsoleSpy.listen();
      }
      installMobxFormatters();

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
      loggerType satisfies never;
  }

  if (config.storeConsoleAccess) {
    window.store = window.store || {};
    window.store[storeName] = store;
  }
};

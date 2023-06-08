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

type PerStoreFilters = {
  filters: { events: StoreEventFilters };
};

export const makeLoggable = <T extends {}>(
  store: T,
  perStoreConfig?: PerStoreFilters
): T => {
  if (process.env.NODE_ENV === 'production' || typeof window === 'undefined') {
    return store;
  }

  if (!isObservable(store)) {
    throw new Error(
      'mobx-log: store is not observable: ' +
        JSON.stringify(store, null, 2) +
        '. Make sure you called makeAutoObservable/makeObservable before calling makeLoggable'
    );
  }

  const loggerType: LoggerType = isReduxDevtoolsAvailable
    ? LoggerType.ReduxDevtools
    : LoggerType.BrowserConsole;

  const storeName = getStoreName(store);
  if (storeName === null) {
    return store;
  }

  switch (loggerType) {
    case LoggerType.ReduxDevtools:
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
      throw new UnreachableCaseError(loggerType);
  }

  if (config.storeConsoleAccess) {
    window.store = window.store || {};
    window.store[storeName] = store;
  }

  return store;
};

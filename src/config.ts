import { DefaultLogger } from './browser-logger/default-logger';
import { Logger } from './types';
import { DefaultLogWriter } from './browser-logger/log-writer';

export type LoggerType = 'redux-devtools' | 'browser-console';

export type Config = {
  logger: Logger;
  debug: boolean;
  storeConsoleAccess: boolean;
  browserConsoleFallback: boolean;
  filters: {
    computeds: boolean;
    actions: boolean;
    observables: boolean;
  };
};

export const config: Config = {
  // Pure so bundlers drop the default logger when makeLoggable is a no-op in production
  logger: /* @__PURE__ */ new DefaultLogger(
    /* @__PURE__ */ new DefaultLogWriter()
  ),
  debug: false,
  storeConsoleAccess: true,
  browserConsoleFallback: true,
  filters: {
    computeds: true,
    actions: true,
    observables: true,
  },
};

type LoggerOptions = Partial<
  Pick<
    Config,
    | 'logger'
    | 'debug'
    | 'storeConsoleAccess'
    | 'browserConsoleFallback'
    | 'filters'
  >
>;

export const configureLogger = (options?: LoggerOptions) => {
  if (options?.logger !== undefined) {
    config.logger = options.logger;
  }
  if (options?.debug !== undefined) {
    config.debug = options.debug;
  }
  if (options?.storeConsoleAccess !== undefined) {
    config.storeConsoleAccess = options.storeConsoleAccess;
  }
  if (options?.browserConsoleFallback !== undefined) {
    config.browserConsoleFallback = options.browserConsoleFallback;
  }
  if (options?.filters !== undefined) {
    config.filters = options.filters;
  }
};

import { DefaultLogger } from './browser-logger/default-logger';
import { Logger } from './types';
import { DefaultLogWriter } from './browser-logger/log-writer';

export enum LoggerType {
  ReduxDevtools = 'redux-devtools',
  BrowserConsole = 'browser-console',
}

export type Config = {
  logger: Logger;
  debug: boolean;
  storeConsoleAccess: boolean;
  filters: {
    computeds: boolean;
    actions: boolean;
    observables: boolean;
  };
};

export const config: Config = {
  logger: new DefaultLogger(new DefaultLogWriter()),
  debug: false,
  storeConsoleAccess: true,
  filters: {
    computeds: true,
    actions: true,
    observables: true,
  },
};

type LoggerOptions = Partial<
  Pick<Config, 'logger' | 'debug' | 'storeConsoleAccess' | 'filters'>
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
  if (options?.filters !== undefined) {
    config.filters = options.filters;
  }
};

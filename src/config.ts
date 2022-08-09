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
  type: LoggerType | null;
  storeConsoleAccess: boolean;
  filters: {
    computeds: boolean;
    actions: boolean;
    observables: boolean;
  };
};

export const config: Config = {
  logger: new DefaultLogger(new DefaultLogWriter()),
  type: null,
  debug: false,
  storeConsoleAccess: false,
  filters: {
    computeds: true,
    actions: true,
    observables: true,
  },
};

type DevToolsOptions = Partial<
  Pick<Config, 'debug' | 'storeConsoleAccess'>
>;

export const configureDevtools = (options?: DevToolsOptions) => {
  config.type = LoggerType.ReduxDevtools;
  if (options?.debug !== undefined) {
    config.debug = options.debug;
  }
  if (options?.storeConsoleAccess !== undefined) {
    config.storeConsoleAccess = options.storeConsoleAccess;
  }
};

type LoggerOptions = Partial<
  Pick<Config, 'logger' | 'debug' | 'storeConsoleAccess' | 'filters'>
>;

export const configureLogger = (options?: LoggerOptions) => {
  config.type = LoggerType.BrowserConsole;
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

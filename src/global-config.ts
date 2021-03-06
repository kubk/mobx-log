import { DefaultLogger } from './default-logger';
import { Logger } from './types';
import { DefaultLogWriter } from './log-writer';

export type GlobalConfig = {
  logger: Logger;
  debug: boolean;
  storeConsoleAccess: boolean;
  filters: {
    computeds: boolean;
    actions: boolean;
    observables: boolean;
  };
};

export const config: GlobalConfig = {
  logger: new DefaultLogger(new DefaultLogWriter()),
  debug: false,
  storeConsoleAccess: false,
  filters: {
    computeds: true,
    actions: true,
    observables: true,
  },
};

export const configureMakeLoggable = (options: Partial<GlobalConfig>) => {
  if (options.logger !== undefined) {
    config.logger = options.logger;
  }
  if (options.debug !== undefined) {
    config.debug = options.debug;
  }
  if (options.storeConsoleAccess !== undefined) {
    config.storeConsoleAccess = options.storeConsoleAccess;
  }
  if (options.filters !== undefined) {
    config.filters = options.filters;
  }
};

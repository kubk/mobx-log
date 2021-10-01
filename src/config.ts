import { DefaultLogger } from './default-logger';
import { Logger } from './types';
import { DefaultLogWriter } from './log-writer';

type Config = {
  logger: Logger;
  debug: boolean;
  storeConsoleAccess: boolean;
};

export const config: Config = {
  logger: new DefaultLogger(new DefaultLogWriter()),
  debug: false,
  storeConsoleAccess: false,
};

export const configureMakeLoggable = (options: Partial<Config>) => {
  if (options.logger !== undefined) {
    config.logger = options.logger;
  }
  if (options.debug !== undefined) {
    config.debug = options.debug;
  }
  if (options.storeConsoleAccess !== undefined) {
    config.storeConsoleAccess = options.storeConsoleAccess;
  }
};

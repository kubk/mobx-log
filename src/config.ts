import { DefaultLogger } from './default-logger';
import { Logger } from './types';
import { DefaultLogWriter } from './log-writer';

type Config = {
  logger: Logger;
  condition: boolean;
  debug: boolean;
  storeConsoleAccess: boolean;
};

export const config: Config = {
  logger: new DefaultLogger(new DefaultLogWriter()),
  condition: true,
  debug: false,
  storeConsoleAccess: false,
};

export const configureMakeLoggable = (options: Partial<Config>) => {
  if (options.logger !== undefined) {
    config.logger = options.logger;
  }
  if (options.condition !== undefined) {
    config.condition = options.condition;
  }
  if (options.debug !== undefined) {
    config.debug = options.debug;
  }
  if (options.storeConsoleAccess !== undefined) {
    config.storeConsoleAccess = options.storeConsoleAccess;
  }
};

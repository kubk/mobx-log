import { DefaultLogger } from './default-logger';
import { Logger } from './types';
import { DefaultLogWriter } from './log-writer';

type Config = {
  logger: Logger;
};

export const config: Config = {
  logger: new DefaultLogger(new DefaultLogWriter()),
};

export const configureMakeLoggable = (options: Config) => {
  config.logger = options.logger;
};

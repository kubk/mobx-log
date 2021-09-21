import { DefaultLogger } from './default-logger';
import { Logger } from './types';
import { DefaultLogWriter } from './log-writer';

type Config = {
  logger: Logger;
  condition: boolean;
};

export const config: Config = {
  logger: new DefaultLogger(new DefaultLogWriter()),
  condition: true,
};

export const configureMakeLoggable = (options: Config) => {
  config.logger = options.logger;
  config.condition = options.condition;
};

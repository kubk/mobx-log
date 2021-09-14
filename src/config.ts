import { DefaultLogger } from './default-logger';
import { DefaultLogWriter } from './default-log-writer';
import { now } from './now';
import { Logger } from './types';

type Config = {
  logger: Logger;
};

export const config: Config = {
  logger: new DefaultLogger(new DefaultLogWriter(), now),
};

export const configureMakeLoggable = (options: Config) => {
  config.logger = options.logger;
};

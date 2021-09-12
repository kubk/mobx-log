import { comparer, spy } from "mobx";
import { log, LogOptions } from "./log";
import { DefaultLogger } from "./default-logger";
import { now } from "./time";

const defaultOptions = {
  logger: new DefaultLogger(console.log, now),
  compare: comparer.default,
};

export const enableLogging = (options: LogOptions = defaultOptions) => {
  // Mobx typings aren't up-to-date
  // @ts-ignore
  spy((event) => log(event, options));
};

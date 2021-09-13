import { spy } from "mobx";
import { log, LogOptions } from "./log";
import { DefaultLogger } from "./default-logger";
import { now } from "./now";

const defaultOptions = {
  logger: new DefaultLogger(console.log, now),
};

export const enableLogging = (options: LogOptions = defaultOptions) => {
  spy((event) => log(event, options));
};

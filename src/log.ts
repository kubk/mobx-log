import type { PureSpyEvent } from "mobx/dist/core/spy";
import { comparer } from "mobx";

export type ComputedEvent = {
  name: string;
  oldValue: unknown;
  newValue: unknown;
};

export type ObservableEvent = {
  name: string;
  oldValue: unknown;
  newValue: unknown;
};

export type ActionEvent = { name: string; arguments: unknown[] };

export type Logger = {
  logObservable(event: ObservableEvent): void;
  logAction(event: ActionEvent): void;
  logComputed(event: ComputedEvent): void;
};

export type LogOptions = {
  logger: Logger;
};

export const log = (event: PureSpyEvent, options: LogOptions): void => {
  const { logger } = options;

  if (event.type === "update") {
    if (event.observableKind === "computed") {
      const equals = comparer.default;
      if (!equals(event.oldValue, event.newValue)) {
        logger.logComputed({
          name: event.debugObjectName,
          oldValue: event.oldValue,
          newValue: event.newValue,
        });
      }
    }
    if (event.observableKind === "object") {
      // @ts-expect-error
      const name = `${event.debugObjectName}.${event.name}`;
      logger.logObservable({
        name,
        newValue: event.newValue,
        oldValue: event.oldValue,
      });
    }
  }
  if (event.type === "action") {
    // @ts-expect-error
    const storeName = event.object?.constructor.name ?? "<unnamed store>";
    logger.logAction({
      name: `${storeName}.${event.name}`,
      arguments: event.arguments,
    });
  }
};

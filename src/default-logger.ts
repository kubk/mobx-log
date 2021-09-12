import { ActionEvent, ComputedEvent, Logger, ObservableEvent } from "./logger";

type Log = (...messages: unknown[]) => void;
type Now = () => string;

export class DefaultLogger implements Logger {
  debug = false;

  constructor(private log: Log, private now: Now) {}

  logObservable(event: ObservableEvent): void {
    if (this.debug) {
      this.log(event);
    }
    this.log(
      this.now(),
      "OBSERVABLE",
      event.name,
      event.oldValue,
      "->",
      event.newValue
    );
  }

  logAction(event: ActionEvent): void {
    if (this.debug) {
      this.log(event);
    }
    this.log(this.now(), "ACTION", event.name, event.arguments);
  }

  logComputed(event: ComputedEvent): void {
    if (this.debug) {
      this.log(event);
    }
    console.log(
      this.now(),
      "COMPUTED",
      event.name,
      event.oldValue,
      "->",
      event.newValue
    );
  }
}

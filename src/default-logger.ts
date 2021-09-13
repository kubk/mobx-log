import { ActionEvent, ComputedEvent, Logger, ObservableEvent } from "./log";

type Write = (...messages: unknown[]) => void;
type Now = () => string;

export class DefaultLogger implements Logger {
  debug = false;

  constructor(private write: Write, private now: Now) {}

  logObservable(event: ObservableEvent): void {
    if (this.debug) {
      this.write(event);
    }
    this.write(
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
      this.write(event);
    }
    this.write(this.now(), "ACTION", event.name, event.arguments);
  }

  logComputed(event: ComputedEvent): void {
    if (this.debug) {
      this.write(event);
    }
    this.write(
      this.now(),
      "COMPUTED",
      event.name,
      event.oldValue,
      "->",
      event.newValue
    );
  }
}

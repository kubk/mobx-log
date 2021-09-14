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

export type Now = () => string;

export type LogWriter = {
  write: (...messages: unknown[]) => void;
};

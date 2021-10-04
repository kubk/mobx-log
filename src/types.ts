export type ComputedEvent = {
  name: string;
  oldValue: unknown;
  newValue: unknown;
};

export type ObservableEvent =
  | { type: 'update'; name: string; oldValue: unknown; newValue: unknown }
  | { type: 'array'; name: string; added: unknown[]; removed: unknown[] };

export type ActionEvent = { name: string; arguments: unknown[] };

export type Logger = {
  logObservable(event: ObservableEvent): void;
  logAction(event: ActionEvent): void;
  logComputed(event: ComputedEvent): void;
};

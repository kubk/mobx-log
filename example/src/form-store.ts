import { action, makeAutoObservable } from 'mobx';
import { makeLoggable } from '../../src';

export class FormStore<T extends Record<string, number>> {
  constructor(public form: T) {
    makeAutoObservable(this, {
      getField: false,
    }, { autoBind: true });
    makeLoggable(this);
  }

  getField<Key extends keyof T>(
    key: Key
  ): { value: T[Key]; onChange: (args: any) => void } {
    return {
      value: this.form[key],
      onChange: action((event) => {
        this.form[key] = +event.currentTarget.value as any as T[Key];
      }),
    };
  }
}

import { makeAutoObservable } from 'mobx';
import { makeLoggable } from '../../src';

export class ParticipantStore {
  value = 1;
  customMap = new Map<number, boolean>();
  customSet: number[] = [];

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  customMapSet(id: number, value: boolean) {
    this.customMap.set(id, value);
  }

  customSetAdd(value: number) {
    this.customSet.push(value);
  }
}

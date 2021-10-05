import { makeAutoObservable } from 'mobx';
import { makeLoggable } from '../../src';

export class ParticipantStore {
  onlineUsers = new Map<number, boolean>();
  adminUsers = new Set<number>();

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }

  onlineUserSet(id: number, value: boolean) {
    this.onlineUsers.set(id, value);
  }

  onlineUserDelete(id: number) {
    this.onlineUsers.delete(id);
  }

  adminUserAdd(value: number) {
    this.adminUsers.add(value);
  }

  adminUserDelete(value: number) {
    this.adminUsers.delete(value);
  }
}

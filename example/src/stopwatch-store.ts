import { makeAutoObservable } from 'mobx';
import { makeLoggable } from '../../src';

export class StopwatchStore {
  countUp = true;
  tickSpeed = 200;
  step = 1;
  count = 0;

  lastIntervalId: number | null = null;

  constructor() {
    makeAutoObservable(
      this,
      {
        lastIntervalId: false,
      },
      { autoBind: true }
    );
    makeLoggable(this);
  }

  start() {
    if (this.lastIntervalId) {
      return;
    }

    this.lastIntervalId = window.setInterval(this.nextStep, this.tickSpeed);
  }

  get isTicking() {
    return !!this.lastIntervalId;
  }

  pause() {
    if (this.lastIntervalId) {
      clearInterval(this.lastIntervalId);
      this.lastIntervalId = null;
    }
  }

  reset() {
    this.count = 0;
  }

  setCount(count: number) {
    this.count = count;
  }

  setCountUp(countUp: boolean) {
    this.countUp = countUp;
  }

  private nextStep = () => {
    if (this.countUp) {
      this.count += this.step;
    } else {
      this.count -= this.step;
    }
  };

  setTickSpeed(tickSpeed: number) {
    this.tickSpeed = tickSpeed;
    this.pause();
    this.start();
  }

  setDiff(diff: number) {
    this.step = diff;
  }
}

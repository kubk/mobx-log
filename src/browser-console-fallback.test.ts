import { makeAutoObservable } from 'mobx';
import { configureLogger, makeLoggable, DefaultLogger } from '../src';
import { describe, it, expect } from 'vitest';
import { CollectingLogWriter } from './browser-logger/log-writer';

// This suite lives in its own file on purpose: `makeLoggable` sets up a
// module-level browser console spy once and freezes the logger it was given.
// A fresh module registry per test file lets the assertions observe the logger
// that is actually active. The disabled case runs first so that a regression
// (the option being ignored) creates the spy with the writer below and the
// expectation catches it.

describe('browserConsoleFallback', () => {
  it('does not log to the console when disabled and Redux devtools are missing', () => {
    const logWriter = new CollectingLogWriter();

    configureLogger({
      logger: new DefaultLogger(logWriter),
      storeConsoleAccess: true,
      browserConsoleFallback: false,
    });

    class CounterDisabled {
      value = 0;

      constructor() {
        makeAutoObservable(this);
        makeLoggable(this);
      }

      increment() {
        this.value++;
      }
    }

    const counter = new CounterDisabled();
    counter.increment();
    counter.increment();

    expect(logWriter.history).toHaveLength(0);
    // storeConsoleAccess keeps working even with the fallback disabled
    expect(window.store).toHaveProperty('CounterDisabled');
  });

  it('logs to the console when enabled and Redux devtools are missing', () => {
    const logWriter = new CollectingLogWriter();

    configureLogger({
      logger: new DefaultLogger(logWriter),
      browserConsoleFallback: true,
    });

    class CounterEnabled {
      value = 0;

      constructor() {
        makeAutoObservable(this);
        makeLoggable(this);
      }

      increment() {
        this.value++;
      }
    }

    const counter = new CounterEnabled();
    counter.increment();
    counter.increment();

    expect(logWriter.history.length).toBeGreaterThan(0);
  });
});

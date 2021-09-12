import { DefaultLogger } from "../src/default-logger";

class LogHistory {
  history: unknown[][] = [];

  log = (...messages: unknown[]) => {
    this.history.push([...messages]);
  }
}

describe("DefaultLogger", () => {
  it("logs observable", () => {
    const logHistory = new LogHistory()
    const plainLogger = new DefaultLogger(logHistory.log, () => '14:34:57');

    plainLogger.logObservable({
      name: "age",
      oldValue: 23,
      newValue: 24,
    });

    expect(logHistory.history).toMatchSnapshot();

    plainLogger.debug = true;

    plainLogger.logObservable({
      name: "age",
      oldValue: 24,
      newValue: 25,
    });

    expect(logHistory.history).toMatchSnapshot();
  });
});

# mobx-log

[![Npm Version](https://badge.fury.io/js/mobx-log.svg)](https://badge.fury.io/js/mobx-log)
[![NPM downloads](http://img.shields.io/npm/dm/mobx-log.svg)](https://www.npmjs.com/package/mobx-log)
[![Tests](https://github.com/kubk/mobx-log/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/kubk/mobx-log/actions/workflows/main.yml)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

Work-in-progress logger for Mobx 6+. It logs Mobx actions, observables and computeds. It also uses custom Chrome formatters, so you won't see awkward `[Proxy, Proxy]` in your console anymore.

### Installation

```
npm i mobx-log
```

### Usage
1. Add `makeLoggable` to a store:

```diff
class SomeStore {
  ...

  constructor() {
    makeAutoObservable(this);
+   makeLoggable(this);
  }
}
```

2. In Chrome DevTools, press F1 to load the Settings. Scroll down to the Console section and check "Enable custom formatters":

![alt text](https://www.mattzeunert.com/img/blog/custom-formatters/custom-formatters-setting.png)

### Customize

In order to customize `mobx-log` use `configureMakeLoggable` function.

- **Recommended**: Spy only in dev mode to get rid of Mobx warning in production:
```js
import { configureMakeLoggable } from 'mobx-log';

configureMakeLoggable({
  condition: process.env.NODE_ENV !== 'production',
});
```

- Enable debug mode (log all Mobx spy reports):
```js
import { configureMakeLoggable } from 'mobx-log';

configureMakeLoggable({
  debug: true
});
```

- Customize logger output. Example - add time for each log entry:
```typescript

import { configureMakeLoggable, DefaultLogger, LogWriter } from 'mobx-log';

export const now = () => {
  const time = new Date();
  const h = time.getHours().toString().padStart(2, '0');
  const m = time.getMinutes().toString().padStart(2, '0');
  const s = time.getSeconds().toString().padStart(2, '0');
  const ms = time.getMilliseconds().toString().padStart(3, '0');

  return `${h}:${m}:${s}.${ms}`;
};

class MyLogWriter implements LogWriter {
  write(...messages: unknown[]) {
    console.log(now(), ...messages);
  }
}

configureMakeLoggable({
  logger: new DefaultLogger(new MyLogWriter()),
});
```

### How it is different from alternatives?
- [mobx-logger](https://github.com/winterbe/mobx-logger) doesn't show observables and computeds with Mobx 6 due to changes in Mobx internals.
- [mobx-remotedev](https://github.com/zalmoxisus/mobx-remotedev/issues) is not maintained anymore.

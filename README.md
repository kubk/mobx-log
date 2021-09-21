### mobx-logger
Work-in-progress logger for Mobx 6+

### Installation

```
npm i mobx-log
```

### Usage

1. Allow Chrome to use custom formatters: 

![alt text](https://www.mattzeunert.com/img/blog/custom-formatters/chrome-settings.png)
![alt text](https://www.mattzeunert.com/img/blog/custom-formatters/custom-formatters-setting.png)

2. Add `makeLoggable` to a store:

```diff
class SomeStore {
  ...

  constructor() {
    makeAutoObservable(this);
+   makeLoggable(this);
  }
}

```

### Features
- Log Mobx actions, observables and computeds
- It uses custom Chrome formatters, so you won't see awkward `[Proxy, Proxy]` in your console anymore.

### Customize

In order to customize `mobx-log` use `configureMakeLoggable` function.

- Add time for each log entry:
```js

import { DefaultLogger, DefaultLogWriter, now } from 'mobx-log';

configureMakeLoggable({
  logger: new DefaultLogger(new DefaultLogWriter(), now),
  condition: true,
});
```
- Spy only in dev mode to get rid of Mobx warning:
```js
import { DefaultLogger, DefaultLogWriter, now } from 'mobx-log';

configureMakeLoggable({
  logger: new DefaultLogger(new DefaultLogWriter(), now),
  condition: process.env.NODE_ENV !== 'production',
});
```

### How it is different from alternatives?
- [mobx-logger](https://github.com/winterbe/mobx-logger) doesn't show observables and computeds with Mobx 6 due to changes in Mobx internals.
- [mobx-remotedev](https://github.com/zalmoxisus/mobx-remotedev/issues) is not maintained anymore.

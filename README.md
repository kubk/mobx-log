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

### How it is different from alternatives?
- [mobx-logger](https://github.com/winterbe/mobx-logger) doesn't show observables and computeds with Mobx 6 due to changes in Mobx internals.
- [mobx-remotedev](https://github.com/zalmoxisus/mobx-remotedev/issues) is not maintained anymore.

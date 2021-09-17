### mobx-logger
Work-in-progress logger for Mobx 6+

### Installation

```
npm i mobx-log
```

### Usage
```js

class SomeStore {
  ...

  constructor() {
    makeAutoObservable(this);
    makeLoggable(this);
  }
}

```

### How it is different from alternatives?
- [mobx-logger](https://github.com/winterbe/mobx-logger) doesn't show observables and computeds with Mobx 6 due to changes in Mobx internals. It also seems like this library isn't maintained anymore because simple feature requests are ignored: [1](https://github.com/winterbe/mobx-logger/issues/20), [2](https://github.com/winterbe/mobx-logger/issues/17), [3](https://github.com/winterbe/mobx-logger/issues/5).

### Todo
- [x] Log computed / action / observable
- [x] Allow styling console output however you want
- [ ] Exclude from production build automatically
- [ ] Colorful diff
- [x] Ask Mobx maintainers how to find out computed comparer automatically or create PR to Mobx

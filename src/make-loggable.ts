import { SpyListener } from './spy-listener';
import { config } from './config';
const Mobx = require('mobx')
const mobxFormatters = require('mobx-formatters')

let spyListener: SpyListener;

export const makeLoggable = (store: Object) => {
  if (!spyListener) {
    mobxFormatters.default(Mobx)
    spyListener = new SpyListener(config.logger);
    spyListener.listen();
  }
  spyListener.addFilterByClass(store.constructor.name);
};

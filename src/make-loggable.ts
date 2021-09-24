import { SpyListener } from './spy-listener';
import { config } from './config';
import {
  ArrayFormatter,
  ChromeFormatter,
  ObjectFormatter,
} from './chrome-formatters';

declare global {
  interface Window {
    devtoolsFormatters: ChromeFormatter<any>[];
  }
}

let spyListener: SpyListener;

const isBrowser = typeof window !== 'undefined';

export const makeLoggable = (store: Object) => {
  if (!config.condition) {
    return;
  }
  if (!spyListener) {
    spyListener = new SpyListener(config.logger, config.debug);
    spyListener.listen();

    if (isBrowser) {
      window.devtoolsFormatters = window.devtoolsFormatters || [];
      window.devtoolsFormatters.push(
        new ArrayFormatter(),
        new ObjectFormatter()
      );
    }
  }
  spyListener.addFilterByClass(store.constructor.name);
};

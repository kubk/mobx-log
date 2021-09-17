import { SpyListener } from './spy-listener';
import { config } from './config';
import { createFormatters } from './chrome-formatters';

let spyListener: SpyListener;

const isBrowser = typeof window !== 'undefined';

export const makeLoggable = (store: Object) => {
  if (!spyListener) {
    spyListener = new SpyListener(config.logger);
    spyListener.listen();

    if (isBrowser) {
      // @ts-ignore
      window.devtoolsFormatters = window.devtoolsFormatters || [];
      const { ArrayFormatter, ObjectFormatter } = createFormatters();
      // @ts-ignore
      window.devtoolsFormatters.push(ArrayFormatter, ObjectFormatter);
    }

  }
  spyListener.addFilterByClass(store.constructor.name);
};

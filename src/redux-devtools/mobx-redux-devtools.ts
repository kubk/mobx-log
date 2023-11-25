import { getDebugName, spy } from 'mobx';
import { toJsWithComputeds } from '../to-js-with-computeds';
import { PureSpyEvent } from 'mobx/dist/core/spy';
import { config } from '../config';
import { Store } from '../store';

type DevtoolsOptions = {
  name?: string;
  features: object;
};

type Devtools = {
  send(data: string, state: Record<string, any>): void;
  init(state: Record<string, any>): void;
};

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: {
      connect(options: DevtoolsOptions): Devtools;
    };
  }
}

export const isReduxDevtoolsAvailable =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;

const devtoolsMap = new Map<string, Devtools>();

const startSpyReport = (event: PureSpyEvent) => {
  if (event.type !== 'action') {
    return;
  }

  if (!event.object) {
    if (config.debug) {
      console.warn(
        'Unable to schedule devtools update because Spy event.object is empty'
      );
    }
    return;
  }
  scheduled.push(() => {
    setTimeout(() => {
      try {
        const name = getDebugName(event.object) + event.name;
      } catch (e: any) {
        if (config.debug) {
          console.warn('Spy object is not observable: ' + e.message);
        }
        return;
      }
      const name = debugNameToHuman(getDebugName(event.object) + event.name);
      const devTools = devtoolsMap.get(getDebugName(event.object));
      if (devTools) {
        devTools.send(name, toJsWithComputeds(event.object));
      }
    });
  });
};

const scheduled: Function[] = [];
const finishSpyReport = () => {
  if (scheduled.length) {
    const toSend = scheduled.pop();
    toSend?.();
  }
};

export const addStoreToDevtools = (store: Store) => {
  initMobxSpy();
  const debugName = getDebugName(store);
  const devtools = createDevtools(debugName);
  devtoolsMap.set(debugName, devtools);
  devtools.init(toJsWithComputeds(store));
};

let isEnabled = false;
const initMobxSpy = () => {
  if (isEnabled) {
    return;
  }
  isEnabled = true;
  spy((event) => {
    if (event.type === 'action') {
      startSpyReport(event);
    }
    if ('spyReportEnd' in event) {
      finishSpyReport();
    }
  });
};

const createDevtools = (name: string) => {
  return window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: name,
    features: {
      pause: false,
      lock: false,
      persist: false,
      export: false,
      import: false,
      jump: false,
      skip: false,
      reorder: false,
      dispatch: false,
      test: false,
    },
  });
};

const debugNameToHuman = (name: string) => {
  return name.replace(/@\d+/, '@');
};

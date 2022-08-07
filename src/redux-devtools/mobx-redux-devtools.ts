import { getDebugName, spy } from 'mobx';
import {
  toJsWithComputeds
} from './to-js-with-computeds';
import { PureSpyEvent } from 'mobx/dist/core/spy';

type DevtoolsOptions = {
  name?: string;
  features: object;
}

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

const devtoolsMap = new Map<string, Devtools>();

export const isReduxDevtoolsAvailable =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;

export const makeDevtoolsLoggable = (store: any) => {
  if (!isReduxDevtoolsAvailable) {
    return;
  }
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

export const mobxReduxDevtoolsConfig = {
  debug: false,
};

const debugNameToHuman = (name: string) => {
  return name.replace(/@\d+/, '@');
};

const scheduled: Function[] = [];
function finishSpyReport() {
  if (scheduled.length) {
    const toSend = scheduled.pop();
    toSend?.();
  }
}

function startSpyReport(event: PureSpyEvent) {
  if (event.type !== 'action')  {
    return;
  }

  if (!event.object) {
    if (mobxReduxDevtoolsConfig.debug) {
      console.warn('Unable to schedule devtools update because Spy event.object is empty');
    }
    return;
  }
  scheduled.push(() => {
    try {
      const name = getDebugName(event.object) + event.name;
    } catch (e: any) {
      if (mobxReduxDevtoolsConfig.debug) {
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
}

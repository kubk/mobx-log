import { comparer, spy } from 'mobx';
import type { PureSpyEvent } from 'mobx/dist/core/spy';
import { Logger } from './types';
import { getStoreName, isStore } from './store';
import { GlobalConfig } from './global-config';

const parseDebugName = (name: string) => {
  return name.replace(/@\d+/, '');
};

export type StoreEventFilters = {
  computeds: boolean;
  observables: boolean;
  actions: boolean;
};

type FiltersPerStore = {
  [storeName in string]: StoreEventFilters;
};

export class SpyListener {
  private filtersPerStore: FiltersPerStore = {};

  constructor(
    private logger: Logger,
    private debug = false,
    private globalFilters: GlobalConfig['filters']
  ) {}

  listen() {
    spy(this.log);
  }

  log = (event: PureSpyEvent) => {
    const { logger } = this;

    if (this.debug) {
      console.log(event);
    }

    if (event.type === 'update') {
      if (event.observableKind === 'computed') {
        if (!this.globalFilters.computeds) {
          return;
        }
        const equals = comparer.default;
        if (!equals(event.oldValue, event.newValue)) {
          const computedFullName = parseDebugName(event.debugObjectName);
          const [storeName] = computedFullName.split('.');
          if (!this.filtersPerStore[storeName]?.computeds) {
            return;
          }
          logger.logComputed({
            name: computedFullName,
            oldValue: event.oldValue,
            newValue: event.newValue,
          });
        }
      }

      if (event.observableKind === 'object') {
        if (!this.globalFilters.observables) {
          return;
        }
        const observableFullName = parseDebugName(event.debugObjectName);
        const [storeName] = observableFullName.split('.');
        if (!this.filtersPerStore[storeName]?.observables) {
          return;
        }
        // Mobx spy adds '[..]' to object name in case change happened inside array
        const isArray = observableFullName.endsWith('[..]');
        const name = `${
          isArray ? observableFullName : storeName
        }.${event.name.toString()}`;

        logger.logObservable({
          type: 'update',
          name,
          newValue: event.newValue,
          oldValue: event.oldValue,
        });
      }
    }

    if (event.type === 'action') {
      if (!isStore(event.object) || !this.globalFilters.actions) {
        return;
      }
      const storeName = getStoreName(event.object);
      if (storeName === null || !this.filtersPerStore[storeName]?.actions) {
        return;
      }

      const action =
        'loggableName' in event.object ? event.name.split('.')[1] : event.name;

      logger.logAction({
        name: `${storeName}.${action}`,
        arguments: event.arguments,
      });
      return;
    }

    if ('observableKind' in event) {
      if (!this.globalFilters.observables) {
        return;
      }

      if (event.observableKind === 'array') {
        const observableFullName = parseDebugName(event.debugObjectName);
        const [storeName, key] = observableFullName.split('.');
        if (!this.filtersPerStore[storeName]?.observables) {
          return;
        }
        logger.logObservable({
          type: event.observableKind,
          name: `${storeName}.${key.toString()}`,
          // @ts-expect-error
          removed: event.removed,
          // @ts-expect-error
          added: event.added,
        });
      }

      if (event.observableKind === 'map') {
        const observableFullName = parseDebugName(event.debugObjectName);
        const [storeName, key] = observableFullName.split('.');
        if (!this.filtersPerStore[storeName]?.observables) {
          return;
        }
        logger.logObservable({
          type: 'map',
          key: event.name,
          value: 'newValue' in event ? event.newValue : undefined,
          oldValue: 'oldValue' in event ? event.oldValue : undefined,
          name: `${storeName}.${key.toString()}`,
          mapType: event.type,
        });
      }

      if (event.observableKind === 'set') {
        const observableFullName = parseDebugName(event.debugObjectName);
        const [storeName, key] = observableFullName.split('.');
        if (!this.filtersPerStore[storeName]?.observables) {
          return;
        }
        const value =
          event.type === 'delete'
            ? event.oldValue
            : event.type === 'add'
            ? event.newValue
            : undefined;

        logger.logObservable({
          type: 'set',
          value,
          name: `${storeName}.${key.toString()}`,
          setType: event.type,
        });
      }
    }
  };

  addFilterByStore(name: string, storeEventFilters: StoreEventFilters) {
    this.filtersPerStore[name] = storeEventFilters;
  }
}

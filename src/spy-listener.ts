import { comparer, spy } from 'mobx';
import type { PureSpyEvent } from 'mobx/dist/core/spy';
import { Logger } from './types';

export class SpyListener {
  private filtersByClass: string[] = [];

  constructor(private logger: Logger, private debug = false) {}

  listen() {
    spy(this.log);
  }

  private log = (event: PureSpyEvent) => {
    const { logger } = this;

    if (this.debug) {
      console.log(event);
    }

    if (event.type === 'update') {
      if (event.observableKind === 'computed') {
        const equals = comparer.default;
        if (!equals(event.oldValue, event.newValue)) {
          const computedFullName = this.parseDebugName(event.debugObjectName);
          const [storeName] = computedFullName.split('.');
          if (!this.filtersByClass.includes(storeName)) {
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
        const observableFullName = this.parseDebugName(event.debugObjectName);
        const [storeName] = observableFullName.split('.');
        if (!this.filtersByClass.includes(storeName)) {
          return;
        }
        // Mobx spy adds '[..]' to object name in case change happened inside array
        const isArray = observableFullName.endsWith('[..]');
        const name = `${isArray ? observableFullName : storeName}.${event.name.toString()}`;
        logger.logObservable({
          name,
          newValue: event.newValue,
          oldValue: event.oldValue,
        });
      }
    }
    if (event.type === 'action') {
      if (typeof event.object !== 'object') {
        return;
      }
      const storeName = event.object?.constructor.name ?? '<unnamed store>';
      if (!this.filtersByClass.includes(storeName)) {
        return;
      }
      logger.logAction({
        name: `${storeName}.${event.name}`,
        arguments: event.arguments,
      });
    }
  };

  private parseDebugName(name: string) {
    return name.replace(/@\d+/, '');
  }

  addFilterByStoreName(name: string) {
    this.filtersByClass.push(name);
  }
}

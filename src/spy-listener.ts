import { comparer, spy } from 'mobx';
import type { PureSpyEvent } from 'mobx/dist/core/spy';
import { Logger } from './types';

export class SpyListener {
  private filtersByClass: string[] = [];

  constructor(private logger: Logger) {}

  listen() {
    spy(this.log);
  }

  private log = (event: PureSpyEvent): void => {
    const { logger } = this;

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
        const storeName = this.parseDebugName(event.debugObjectName);
        if (!this.filtersByClass.includes(storeName)) {
          return;
        }
        // @ts-expect-error
        const name = `${storeName}.${event.name}`;
        logger.logObservable({
          name,
          newValue: event.newValue,
          oldValue: event.oldValue,
        });
      }
    }
    if (event.type === 'action') {
      // @ts-expect-error
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

  private parseDebugName(name: string): string {
    return name.replace(/@\d+/, '');
  }

  addFilterByClass(name: string): void {
    this.filtersByClass.push(name);
  }
}

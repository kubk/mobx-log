import { isComputedProp, toJS } from 'mobx';
import { Store } from './store';

const getComputeds = (store: Store) => {
  const computeds: Record<string, any> = {};

  Object.getOwnPropertyNames(store).forEach((prop) => {
    if (isComputedProp(store, prop)) {
      try {
        computeds[prop] = store[prop];
      } catch (e) {
        // If an exception was thrown we don't want to leave devtools in a broken state
        computeds[prop] = '*Exception*';
      }
    }
  });

  return computeds;
};

export const toJsWithComputeds = (store: any) => {
  return { ...toJS(store), ...getComputeds(store) };
};

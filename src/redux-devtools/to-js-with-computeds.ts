import { isComputedProp, toJS } from 'mobx';

const getComputeds = (store: any) => {
  const computeds: Record<string, any> = {};

  Object.getOwnPropertyNames(store).forEach((prop) => {
    if (isComputedProp(store, prop)) {
      computeds[prop] = store[prop];
    }
  });

  return computeds;
};

export const toJsWithComputeds = (store: any) => {
  return { ...toJS(store), ...getComputeds(store)};
};

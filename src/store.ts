export type Store = {
  [key: string]: unknown;
};

export const isStore = (store: unknown): store is Store => {
  return store instanceof Object;
};

const getStoreType = (store: Store): 'object' | 'classInstance' => {
  if (store.constructor.name === 'Object') {
    return 'object';
  }
  return 'classInstance';
};

export const getStoreName = (store: Store): string => {
  switch (getStoreType(store)) {
    case 'object': {
      if (
        !('loggableName' in store) ||
        typeof store.loggableName !== 'string'
      ) {
        throw new Error(
          'mobx-log error: store name is undefined. Have you forgotten to pass loggableName as a string?'
        );
      }
      return store.loggableName;
    }
    case 'classInstance':
      return store.constructor.name;
  }
};

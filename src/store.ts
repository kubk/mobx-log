export type Store = {
  [key: string]: any;
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

export const getStoreName = (store: Store): string | null => {
  switch (getStoreType(store)) {
    case 'object': {
      return 'loggableName' in store && typeof store.loggableName === 'string'
        ? store.loggableName
        : null;
    }
    case 'classInstance':
      return store.constructor.name;
  }
};

import { observable, AnnotationsMap } from 'mobx';
import { useState } from 'react';
import { makeLoggable } from './make-loggable';

export function useLoggableLocalObservable<
  TStore extends Record<string, any> & { loggableName: string }
>(
  initializer: () => TStore,
  annotations?: AnnotationsMap<TStore, never>
): TStore {
  return useState(() => {
    return makeLoggable(
      observable(initializer(), annotations, { autoBind: true })
    );
  })[0];
}

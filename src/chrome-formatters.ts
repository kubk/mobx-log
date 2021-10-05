import {
  isObservableArray,
  isObservableMap,
  isObservableObject,
  isObservableSet,
  ObservableMap,
  ObservableSet,
  toJS,
} from 'mobx';

type Css = { style: string };
type Chunk = [string, Css, string];
type Header = [string, Chunk, [string, string]];
type Body = [string, Css, ...any[]];

export type ChromeFormatter<T> = {
  header: (argument: T) => Header | null;
  hasBody: (argument: T) => boolean;
  body: (argument: T) => Body;
};

const styles = {
  mobxName: { style: 'color: rgb(232,98,0)' },
  nullName: { style: 'color: #777' },
  list: {
    style:
      'list-style-type: none; padding: 0; margin: 0 0 0 12px; font-style: normal',
  },
};

const reference = (object: unknown) => {
  if (typeof object === 'undefined' || typeof object === null) {
    return ['span', styles.nullName, typeof object];
  }
  return ['object', { object }];
};

const renderIterableHeader = (
  iterable:
    | ArrayLike<unknown>
    | ObservableMap<unknown, unknown>
    | ObservableSet<unknown>,
  name: string
): Header => {
  const count =
    isObservableMap(iterable) || isObservableSet(iterable)
      ? iterable.size
      : iterable.length;

  return ['span', ['span', styles.mobxName, name], ['span', `[${count}]`]];
};

const renderIterableBody = (
  collection:
    | ArrayLike<unknown>
    | ObservableMap<unknown, unknown>
    | ObservableSet<unknown>
    | {},
  mapper: (val: [string, unknown]) => unknown
): Body => {
  if (isObservableMap(collection) || isObservableSet(collection)) {
    // @ts-ignore
    const children = Array.from(toJS(collection)).map(mapper);
    return ['ol', styles.list, ...children];
  }

  const children = Object.entries(toJS(collection)).map(mapper);
  return ['ol', styles.list, ...children];
};

export class ObjectFormatter implements ChromeFormatter<{}> {
  header(argument: {}): Header | null {
    return isObservableObject(argument)
      ? renderIterableHeader(Object.keys(argument), 'Object')
      : null;
  }

  hasBody(argument: {}): boolean {
    return Object.keys(argument).length > 0;
  }

  body(argument: {}) {
    return renderIterableBody(argument, ([key, value]) => [
      'li',
      {},
      reference(key),
      ': ',
      reference(value),
    ]);
  }
}

export class ArrayFormatter implements ChromeFormatter<ArrayLike<unknown>> {
  header(argument: ArrayLike<unknown>): Header | null {
    return isObservableArray(argument)
      ? renderIterableHeader(argument, 'Array')
      : null;
  }

  hasBody(argument: ArrayLike<unknown>): boolean {
    return argument.length > 0;
  }

  body(argument: ArrayLike<unknown>): Body {
    return renderIterableBody(argument, ([_, value]) => [
      'li',
      reference(value),
    ]);
  }
}

export class MapFormatter implements ChromeFormatter<Map<unknown, unknown>> {
  header(argument: Map<unknown, unknown>): Header | null {
    return isObservableMap(argument)
      ? renderIterableHeader(argument, 'Map')
      : null;
  }

  hasBody(argument: Map<unknown, unknown>): boolean {
    return argument.size > 0;
  }

  body(argument: Map<unknown, unknown>): Body {
    return renderIterableBody(argument, ([key, value]) => [
      'li',
      {},
      reference(key),
      ': ',
      reference(value),
    ]);
  }
}

export class SetFormatter implements ChromeFormatter<Set<unknown>> {
  header(argument: Set<unknown>): Header | null {
    return isObservableSet(argument)
      ? renderIterableHeader(argument, 'Set')
      : null;
  }

  hasBody(argument: Set<unknown>): boolean {
    return argument.size > 0;
  }

  body(argument: Set<unknown>): Body {
    return renderIterableBody(argument, (value) => ['li', reference(value)]);
  }
}

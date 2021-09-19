import { isObservableArray, isObservableObject, toJS } from 'mobx';

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
  iterable: ArrayLike<unknown>,
  name: string
): Header => [
  'span',
  ['span', styles.mobxName, name],
  ['span', `[${iterable.length}]`],
];

const hasBody = (collection: ArrayLike<unknown>) => collection.length > 0;

const renderIterableBody = (
  collection: ArrayLike<unknown> | {},
  mapper: (val: [string, unknown]) => unknown
): Body => {
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
    return hasBody(Object.keys(argument));
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
  body(argument: ArrayLike<unknown>): Body {
    return renderIterableBody(argument, ([_, value]) => [
      'li',
      reference(value),
    ]);
  }

  hasBody(argument: ArrayLike<unknown>): boolean {
    return hasBody(argument);
  }

  header(argument: ArrayLike<unknown>): Header | null {
    return isObservableArray(argument)
      ? renderIterableHeader(argument, 'Array')
      : null;
  }
}

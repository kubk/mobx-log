import { isObservableArray, isObservableObject, toJS } from 'mobx';

const listStyle = {
  style:
    'list-style-type: none; padding: 0; margin: 0 0 0 12px; font-style: normal',
};
const mobxNameStyle = { style: 'color: rgb(232,98,0)' };
const nullStyle = { style: 'color: #777' };

export const createFormatters = () => {
  const reference = (object: any, config?: any) => {
    if (typeof object === 'undefined') {
      return ['span', nullStyle, 'undefined'];
    } else if (object === 'null') {
      return ['span', nullStyle, 'null'];
    }

    return ['object', { object, config }];
  };

  const renderIterableHeader = (iterable: any, name = 'Iterable') => [
    'span',
    ['span', mobxNameStyle, name],
    ['span', `[${iterable.length}]`],
  ];

  const hasBody = (collection: any, config?: any) =>
    collection.length > 0 && !(config && config.noPreview);

  const renderIterableBody = (collection: any, mapper: any) => {
    const children = Object.entries(toJS(collection)).map(mapper);
    return ['ol', listStyle, ...children];
  };

  const ObjectFormatter = {
    header(o: any) {
      if (!isObservableObject(o)) {
        return null;
      }
      return renderIterableHeader(Object.keys(o), 'Object');
    },
    hasBody: (o: any) => hasBody(Object.keys(o)),
    body(o: any) {
      return renderIterableBody(o, ([key, value]: any) => [
        'li',
        {},
        reference(key),
        ': ',
        reference(value),
      ]);
    },
  };

  const ArrayFormatter = {
    header(o: any) {
      if (!isObservableArray(o)) {
        return null;
      }
      return renderIterableHeader(o, 'Array');
    },
    hasBody,
    body(o: any) {
      return renderIterableBody(o, ([_, value]: any) => [
        'li',
        reference(value),
      ]);
    },
  };

  return {
    ObjectFormatter,
    ArrayFormatter,
  };
};

import { observable } from 'mobx';
import {
  ArrayFormatter,
  MapFormatter,
  ObjectFormatter,
  SetFormatter,
} from './chrome-formatters';

describe('ChromeFormatters', () => {
  it('ObjectFormatter returns null for non observable object', () => {
    const objectFormatter = new ObjectFormatter();
    expect(objectFormatter.header([1, 2, 3])).toBeNull();
    expect(objectFormatter.header({ a: 1, b: 2 })).toBeNull();
  });

  it('ObjectFormatter formats object', () => {
    const userState = observable({ age: 23, name: 'Test' });

    const objectFormatter = new ObjectFormatter();

    expect(objectFormatter.header(userState)).toMatchSnapshot();
    expect(objectFormatter.body(userState)).toMatchSnapshot();
    expect(objectFormatter.hasBody(userState)).toBeTruthy();
  });

  it('ArrayFormatter returns null for non observable object', () => {
    const arrayFormatter = new ArrayFormatter();
    expect(arrayFormatter.header([1, 2, 3])).toBeNull();
    // @ts-expect-error
    expect(arrayFormatter.header({ a: 1, b: 2 })).toBeNull();
  });

  it('ArrayFormatter formats observable array', () => {
    const users = [
      observable({ age: 23, name: 'Test 1' }),
      observable({ age: 55, name: 'Test 2' }),
      observable({ age: 99, name: 'Test 2' }),
    ];

    const arrayFormatter = new ArrayFormatter();

    expect(arrayFormatter.header(users)).toMatchSnapshot();
    expect(arrayFormatter.body(users)).toMatchSnapshot();
    expect(arrayFormatter.hasBody(users)).toBeTruthy();
  });

  it('MapFormatter returns null for non observable map', () => {
    const mapFormatter = new MapFormatter();
    // @ts-expect-error
    expect(mapFormatter.header([1, 2, 3])).toBeNull();
    // @ts-expect-error
    expect(mapFormatter.header({ a: 1, b: 2 })).toBeNull();
  });

  it('MapFormatter formats observable map', () => {
    const map = observable.map({ a: 1, b: 2 });

    const mapFormatter = new MapFormatter();

    expect(mapFormatter.header(map)).toMatchSnapshot();
    expect(mapFormatter.body(map)).toMatchSnapshot();
    expect(mapFormatter.hasBody(map)).toBeTruthy();
  });

  it('SetFormatter returns null for non observable set', () => {
    const setFormatter = new SetFormatter();
    // @ts-expect-error
    expect(setFormatter.header([1, 2, 3])).toBeNull();
    // @ts-expect-error
    expect(setFormatter.header({ a: 1, b: 2 })).toBeNull();
  });

  it('SetFormatter formats observable set', () => {
    const set = observable.set([1, 2, 3]);

    const setFormatter = new SetFormatter();

    expect(setFormatter.header(set)).toMatchSnapshot();
    expect(setFormatter.body(set)).toMatchSnapshot();
    expect(setFormatter.hasBody(set)).toBeTruthy();
  });
});

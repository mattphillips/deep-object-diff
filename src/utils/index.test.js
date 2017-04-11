import forEach from 'jest-each';

import { isDate, isEmpty, isObject } from './';

describe('utils', () => {

  describe('.isDate', () => {
    forEach([
      [new Date()],
      [new Date('2016')],
      [new Date('2016-01')],
      [new Date('2016-01-01')],
      [new Date('2016-01-01:14:45:20')],
      [new Date('Tue Feb 14 2017 14:45:20 GMT+0000 (GMT)')],
      [new Date('nonsense')],
    ]).test('returns true when given a date object of %s', (date) => {
      expect(isDate(date)).toBe(true);
    });

    forEach([
      [100],
      ['100'],
      [false],
      [{ a: 100 }],
      [[100, 101, 102]],
      [Date.parse('2016')],
      [Date.now()],
    ]).test('returns false when not given a date object of %s', (x) => {
      expect(isDate(x)).toBe(false);
    });
  });

  describe('.isEmpty', () => {
    describe('returns true', () => {
      test('when given an empty object', () => {
        expect(isEmpty({})).toBe(true);
      });

      test('when given an empty array', () => {
        expect(isEmpty([])).toBe(true);
      });
    });

    describe('returns false', () => {
      test('when given an empty object', () => {
        expect(isEmpty({ a: 1 })).toBe(false);
      });

      test('when given an empty array', () => {
        expect(isEmpty([1])).toBe(false);
      });
    });
  });

  describe('.isObject', () => {
    test('returns true when value is an object', () => {
      expect(isObject({})).toBe(true);
    });

    test('returns true when value is an array', () => {
      expect(isObject([])).toBe(true);
    });

    forEach([
      ['int', 1],
      ['string', 'a'],
      ['boolean', true],
      ['null', null],
      ['undefined', undefined],
      ['function', () => ({})],
    ]).test('returns false when value is of type: %s', (type, value) => {
      expect(isObject(value)).toBe(false);
    });
  });
});

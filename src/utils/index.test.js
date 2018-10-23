import { isDate, isEmpty, isObject, properObject } from './';

describe('utils', () => {

  describe('.isDate', () => {
    test.each([
      [new Date()],
      [new Date('2016')],
      [new Date('2016-01')],
      [new Date('2016-01-01')],
      [new Date('2016-01-01:14:45:20')],
      [new Date('Tue Feb 14 2017 14:45:20 GMT+0000 (GMT)')],
      [new Date('nonsense')],
    ])('returns true when given a date object of %s', (date) => {
      expect(isDate(date)).toBe(true);
    });

    test.each([
      [100],
      ['100'],
      [false],
      [{ a: 100 }],
      [[100, 101, 102]],
      [Date.parse('2016')],
      [Date.now()],
    ])('returns false when not given a date object of %s', (x) => {
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

    test.each([
      ['int', 1],
      ['string', 'a'],
      ['boolean', true],
      ['null', null],
      ['undefined', undefined],
      ['function', () => ({})],
    ])('returns false when value is of type: %s', (type, value) => {
      expect(isObject(value)).toBe(false);
    });
  });

  describe('.properObject', () => {
    it('returns given object when object has keys and hasOwnProperty function', () => {
      const o = { a: 1 };
      const a = [1];
      expect(properObject(o)).toBe(o);
      expect(properObject(a)).toBe(a);
    });

    it('returns given value when value is not an object', () => {
      const o = 'hello';
      expect(properObject(o)).toBe(o);
    });

    it('returns object that has given keys and hasOwnProperty function when given object is created from a null', () => {
      const o = Object.create(null);
      o.a = 1;
      const actual = properObject(o);
      expect(actual).toEqual({ a: 1 });
      expect(typeof actual.hasOwnProperty === 'function').toBe(true);
      expect(actual).not.toBe(o);
    });
  });
});

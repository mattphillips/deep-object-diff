import forEach from 'jest-each';

import deletedDiff from './';

describe('.deletedDiff', () => {

  describe('base case', () => {
    describe('equal', () => {
      forEach([
        ['int', 1],
        ['string', 'a'],
        ['boolean', true],
        ['null', null],
        ['undefined', undefined],
        ['object', { a: 1 }],
        ['array', [1]],
        ['function', () => ({})],
        ['date', new Date()],
      ]).test('returns empty object when given values of type %s are equal', (type, value) => {
        expect(deletedDiff(value, value)).toEqual({});
      });
    });

    describe('not equal and not object', () => {
      forEach([
        [1, 2],
        ['a', 'b'],
        [true, false],
        ['hello', null],
        ['hello', undefined],
        [null, undefined],
        [undefined, null],
        [null, { a: 1 }],
        ['872983', { areaCode: '+44', number: '872983' }],
        [100, () => ({})],
        [() => ({}), 100],
        [new Date('2017-01-01'), new Date('2017-01-02')],
      ]).test('returns empty object when given values are unequal', (lhs, rhs) => {
        expect(deletedDiff(lhs, rhs)).toEqual({});
      });
    });
  });

  describe('recursive case', () => {
    describe('object', () => {
      test('returns empty object when rhs has been updated', () => {
        expect(deletedDiff({ a: 1 }, { a: 2 })).toEqual({});
      });

      test('returns empty object when right hand side has been added to', () => {
        expect(deletedDiff({ a: 1 }, { a: 1, b: 2 })).toEqual({});
      });

      test('returns keys as undefined when deleted from right hand side root', () => {
        expect(deletedDiff({ a: 1, b: { c: 2 }}, { a: 1 })).toEqual({ b: undefined });
      });

      test('returns keys as undefined when deeply deleted from right hand side', () => {
        expect(deletedDiff({ a: { b: 1 }, c: 2, d: { e: 100 } }, { a: { b: 1 }, c: 2, d: {} })).toEqual({ d: { e: undefined } });
      });

      test('returns subset of right hand side with deleted date', () => {
        expect(deletedDiff({ date: new Date('2016') }, {})).toEqual({ date: undefined });
      });
    });

    describe('arrays', () => {
      test('returns empty object when rhs array has been updated', () => {
        expect(deletedDiff([1], [2])).toEqual({});
      });

      test('returns empty object when right hand side array has additions', () => {
        expect(deletedDiff([1, 2, 3], [1, 2, 3, 9])).toEqual({});
      });

      test('returns subset of right hand side array as object of indices to value when right hand side array has deletions', () => {
        expect(deletedDiff([1, 2, 3], [1, 3])).toEqual({ 2: undefined });
      });

      test('returns subset of right hand side with added date', () => {
        expect(deletedDiff([new Date('2016')], [])).toEqual({ 0: undefined });
      });
    });
  });
});

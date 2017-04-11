import forEach from 'jest-each';

import diff from './';

describe('.diff', () => {

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
        expect(diff(value, value)).toEqual({});
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
      ]).test('returns right hand side value when different to left hand side value (%s, %s)', (lhs, rhs) => {
        expect(diff(lhs, rhs)).toEqual(rhs);
      });
    });
  });

  describe('recursive case', () => {
    describe('object', () => {
      test('returns right hand side value when given objects are different', () => {
        expect(diff({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
      });

      test('returns right hand side value when right hand side value is null', () => {
        expect(diff({ a: 1 }, { a: null })).toEqual({ a: null });
      });

      test('returns subset of right hand side value when sibling objects differ', () => {
        expect(diff({ a: { b: 1 }, c: 2 }, { a: { b: 1 }, c: 3 })).toEqual({ c: 3 });
      });

      test('returns subset of right hand side value when nested values differ', () => {
        expect(diff({ a: { b: 1, c: 2} }, { a: { b: 1, c: 3 } })).toEqual({ a: { c: 3 } });
      });

      test('returns subset of right hand side value when nested values differ at multiple paths', () => {
        expect(diff({ a: { b: 1 }, c: 2, d: { e: 100 } }, { a: { b: 99 }, c: 3, d: { e: 100 } })).toEqual({ a: { b: 99 }, c: 3 });
      });

      test('returns subset of right hand side value when a key value has been deleted', () => {
        expect(diff({ a: { b: 1 }, c: 2, d: { e: 100 } }, { a: { b: 1 }, c: 2, d: {} })).toEqual({ d: { e: undefined } });
      });

      test('returns subset of right hand side value when a key value has been added', () => {
        expect(diff({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
      });

      test('returns keys as undefined when deleted from right hand side', () => {
        expect(diff({ a: 1, b: { c: 2 }}, { a: 1 })).toEqual({ b: undefined });
      });
    });

    describe('arrays', () => {
      test('returns right hand side value as object of indices to value when arrays are different', () => {
        expect(diff([1], [2])).toEqual({ 0: 2 });
      });

      test('returns subset of right hand side array as object of indices to value when arrays differs at multiple indicies', () => {
        expect(diff([1, 2, 3], [9, 8, 3])).toEqual({ 0: 9, 1: 8 });
      });

      test('returns subset of right hand side array as object of indices to value when right hand side array has deletions', () => {
        expect(diff([1, 2, 3], [1, 3])).toEqual({ 1: 3, 2: undefined });
      });

      test('returns subset of right hand side array as object of indices to value when right hand side array has additions', () => {
        expect(diff([1, 2, 3], [1, 2, 3, 9])).toEqual({ 3: 9 });
      });
    });

    describe('date', () => {
      const lhs = new Date('2016');
      const rhs = new Date('2017');
      test('returns right hand side date when updated', () => {
        expect(diff({ date: lhs }, { date: rhs })).toEqual({ date: rhs });
        expect(diff([lhs], [rhs])).toEqual({ 0: rhs });
      });

      test('returns undefined when date deleted', () => {
        expect(diff({ date: lhs }, {})).toEqual({ date: undefined });
        expect(diff([lhs], [])).toEqual({ 0: undefined });
      });

      test('returns right hand side when date is added', () => {
        expect(diff({}, { date: rhs })).toEqual({ date: rhs });
        expect(diff([], [rhs])).toEqual({ 0: rhs });
      });
    });
  });
});

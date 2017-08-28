import forEach from 'jest-each';

import addedDiff from './';

describe('.addedDiff', () => {

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
        expect(addedDiff(value, value)).toEqual({});
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
      ]).test('returns empty object when values are not equal (%s, %s)', (lhs, rhs) => {
        expect(addedDiff(lhs, rhs)).toEqual({});
      });
    });
  });

  describe('recursive case', () => {
    describe('object', () => {
      test('returns empty object when given objects are updated', () => {
        expect(addedDiff({ a: 1 }, { a: 2 })).toEqual({});
      });

      test('returns empty object when right hand side has deletion', () => {
        expect(addedDiff({ a: 1, b: 2 }, { a: 1 })).toEqual({});
      });

      test('returns subset of right hand side value when a key value has been added to the root', () => {
        expect(addedDiff({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
      });

      test('returns subset of right hand side value when a key value has been added deeply', () => {
        expect(addedDiff({ a: { b: 1} }, { a: { b: 1, c: 2 } })).toEqual({ a: { c: 2 } });
      });

      test('returns subset of right hand side with added date', () => {
        expect(addedDiff({}, { date: new Date('2016') })).toEqual({ date: new Date('2016') });
      });

      test('returns ..', () => {
        expect(addedDiff(
          [{one: true, two: true, three: true}],
          [{inserted: true, one: true, two: true, three: true}]
        )).toEqual({0: {inserted: true}});
      });

      test('returns ..', () => {
        const orig = {
          domains: [{
            commands: [
                {name: 'one'},
                {name: 'two'},
                {name: 'three'}
            ]
          }]
        };
        const updated = {
          domains: [{
            commands: [
                {name: 'inserted'},
                {name: 'one'},
                {name: 'two'},
                {name: 'three'}
            ]
          }]
        };

        expect(addedDiff(orig, updated)).not.toEqual({'domains': {'0': {'commands': {'3': {'name': 'three'}}}}});
        expect(addedDiff(orig, updated)).toEqual({'domains': {'0': {'commands': {'0': {'name': 'inserted'}}}}});
      });
    });

    describe('arrays', () => {
      test('returns empty object when array is updated', () => {
        expect(addedDiff([1], [2])).toEqual({});
      });

      test('returns empty object when right hand side array has deletions', () => {
        expect(addedDiff([1, 2, 3], [1, 3])).toEqual({});
      });

      test('returns subset of right hand side array as object of indices to value when right hand side array has additions', () => {
        expect(addedDiff([1, 2, 3], [1, 2, 3, 9])).toEqual({ 3: 9 });
      });

      test('returns subset of right hand side with added date', () => {
        expect(addedDiff([], [new Date('2016')])).toEqual({ 0: new Date('2016') });
      });
    });

    describe('object create null', () => {
      test('returns subset of right hand side value when a key value has been added to the root', () => {
        const lhs = Object.create(null);
        const rhs = Object.create(null);
        lhs.a = 1;
        rhs.a = 1;
        rhs.b = 2;
        expect(addedDiff(lhs, rhs)).toEqual({ b: 2 });
      });

      test('returns subset of right hand side value when a key value has been added deeply', () => {
        const lhs = Object.create(null);
        const rhs = Object.create(null);
        lhs.a = { b: 1};
        rhs.a = { b: 1, c: 2 };
        expect(addedDiff(lhs, rhs)).toEqual({ a: { c: 2 } });
      });

      test('returns subset of right hand side with added date', () => {
        const lhs = Object.create(null);
        const rhs = Object.create(null);
        rhs.date = new Date('2016');
        expect(addedDiff(lhs, rhs)).toEqual({ date: new Date('2016') });
      });
    });
  });
});

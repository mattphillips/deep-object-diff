import { expect } from 'chai';
import forEach from 'mocha-each';

import updatedDiff from './';

describe('.updatedDiff', () => {

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
      ]).it('returns empty object when given values of type %s are equal', (type, value) => {
        expect(updatedDiff(value, value)).to.deep.equal({});
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
      ]).it('returns right hand side value when different to left hand side value (%s, %s)', (lhs, rhs) => {
        expect(updatedDiff(lhs, rhs)).to.deep.equal(rhs);
      });
    });
  });

  describe('recursive case', () => {
    describe('object', () => {
      it('returns right hand side value when given objects are different at root', () => {
        expect(updatedDiff({ a: 1 }, { a: 2 })).to.deep.equal({ a: 2 });
      });

      it('returns right hand side value when right hand side value is null', () => {
        expect(updatedDiff({ a: 1 }, { a: null })).to.deep.equal({ a: null });
      });

      it('returns subset of right hand side value when sibling objects differ', () => {
        expect(updatedDiff({ a: { b: 1 }, c: 2 }, { a: { b: 1 }, c: 3 })).to.deep.equal({ c: 3 });
      });

      it('returns subset of right hand side value when nested values differ', () => {
        expect(updatedDiff({ a: { b: 1, c: 2} }, { a: { b: 1, c: 3 } })).to.deep.equal({ a: { c: 3 } });
      });

      it('returns subset of right hand side value when nested values differ at multiple paths', () => {
        expect(updatedDiff({ a: { b: 1 }, c: 2, d: { e: 100 } }, { a: { b: 99 }, c: 3, d: { e: 100 } })).to.deep.equal({ a: { b: 99 }, c: 3 });
      });

      it('returns empty object when deleted from right hand side', () => {
        expect(updatedDiff({ a: 1, b: { c: 2 }}, { a: 1 })).to.deep.equal({});
      });

      it('returns empty object when a key value has been added', () => {
        expect(updatedDiff({ a: 1 }, { a: 1, b: 2 })).to.deep.equal({});
      });

      it('returns subset of right hand side with updated date', () => {
        expect(updatedDiff({ date: new Date('2016') }, { date: new Date('2017') })).to.eql({ date: new Date('2017') });
      });
    });

    describe('arrays', () => {
      it('returns right hand side value as object of indices to value when arrays are different', () => {
        expect(updatedDiff([1], [2])).to.deep.equal({ 0: 2 });
      });

      it('returns subset of right hand side array as object of indices to value when arrays differs at multiple indicies', () => {
        expect(updatedDiff([1, 2, 3], [9, 8, 3])).to.deep.equal({ 0: 9, 1: 8 });
      });

      it('returns subset of right hand side array as object of indices to value when right hand side array has deletions', () => {
        expect(updatedDiff([1, 2, 3], [1, 3])).to.deep.equal({ 1: 3 });
      });

      it('returns empty object when right hand side array has additions', () => {
        expect(updatedDiff([1, 2, 3], [1, 2, 3, 9])).to.deep.equal({});
      });

      it('returns subset of right hand side with updated date', () => {
        expect(updatedDiff([new Date('2016')], [new Date('2017')])).to.eql({ 0: new Date('2017') });
      });
    });
  });
});

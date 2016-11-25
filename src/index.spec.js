import { expect } from 'chai';

import diff from './';

describe('.diff', () => {

  describe('base case', () => {
    describe('equal', () => {
      it('returns empty object when given ints are equal', () => {
        expect(diff(1, 1)).to.deep.equal({});
      });

      it('returns empty object when given strings are equal', () => {
        expect(diff('a', 'a')).to.deep.equal({});
      });

      it('returns empty object when given booleans are equal', () => {
        expect(diff(true, true)).to.deep.equal({});
      });

      it('returns empty object when given parameters are null', () => {
        expect(diff(null, null)).to.deep.equal({});
      });

      it('returns empty object when given parameters are undefined', () => {
        expect(diff(undefined, undefined)).to.deep.equal({});
      });

      it('returns empty object when given objects are equal', () => {
        expect(diff({ a: 1 }, { a: 1 })).to.deep.equal({});
      });

      it('returns empty object when given arrays are equal', () => {
        expect(diff([1], [1])).to.deep.equal({});
      });
    });

    describe('not equal and not object', () => {
      it('returns right hand side value when given ints are different', () => {
        expect(diff(1, 2)).to.deep.equal(2);
      });

      it('returns right hand side value when given strings are different', () => {
        expect(diff('a', 'b')).to.deep.equal('b');
      });

      it('returns right hand side value when given booleans are different', () => {
        expect(diff(true, false)).to.deep.equal(false);
      });

      it('returns right hand side value when given values are not both null', () => {
        expect(diff('hello', null)).to.deep.equal(null);
      });

      it('returns right hand side value when given values are not both undefined', () => {
        expect(diff('hello', undefined)).to.deep.equal(undefined);
      });
    });
  });

  describe('recursive case', () => {
    describe('object', () => {
      it('returns right hand side value when given objects are different', () => {
        expect(diff({ a: 1 }, { a: 2 })).to.deep.equal({ a: 2 });
      });

      it('returns subset of right hand side value when sibling objects differ', () => {
        expect(diff({ a: { b: 1 }, c: 2 }, { a: { b: 1 }, c: 3 })).to.deep.equal({ c: 3 });
      });

      it('returns subset of right hand side value when nested values differ', () => {
        expect(diff({ a: { b: 1, c: 2} }, { a: { b: 1, c: 3 } })).to.deep.equal({ a: { c: 3 } });
      });

      it('returns subset of right hand side value when nested values differ at multiple paths', () => {
        expect(diff({ a: { b: 1 }, c: 2, d: { e: 100 } }, { a: { b: 99 }, c: 3, d: { e: 100 } })).to.deep.equal({ a: { b: 99 }, c: 3 });
      });

      it('returns subset of right hand side value when a key value has been deleted', () => {
        expect(diff({ a: { b: 1 }, c: 2, d: { e: 100 } }, { a: { b: 1 }, c: 2, d: {} })).to.deep.equal({ d: {} });
      });

      it('returns subset of right hand side value when a key value has been added', () => {
        expect(diff({ a: 1 }, { a: 1, b: 2 })).to.deep.equal({ b: 2 });
      });
    });

    describe('arrays', () => {
      it('returns right hand side value as object of indices to value when arrays are different', () => {
        expect(diff([1], [2])).to.deep.equal({ 0: 2 });
      });

      it('returns subset of right hand side array as object of indices to value when arrays differs at multiple indicies', () => {
        expect(diff([1, 2, 3], [9, 8, 3])).to.deep.equal({ 0: 9, 1: 8 });
      });

      it('returns subset of right hand side array as object of indices to value when right hand side array has deletions', () => {
        expect(diff([1, 2, 3], [1, 3])).to.deep.equal({ 1: 3 });
      });

      it('returns subset of right hand side array as object of indices to value when right hand side array has additions', () => {
        expect(diff([1, 2, 3], [1, 2, 3, 9])).to.deep.equal({ 3: 9 });
      });
    });
  });
});
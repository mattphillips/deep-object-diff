import { expect } from 'chai';
import forEach from 'mocha-each';

import { isEmpty, isObject } from './';

describe('utils', () => {

  describe('.isEmpty', () => {
    describe('returns true', () => {
      it('when given an empty object', () => {
        expect(isEmpty({})).to.be.true;
      });

      it('when given an empty array', () => {
        expect(isEmpty([])).to.be.true;
      });
    });

    describe('returns false', () => {
      it('when given an empty object', () => {
        expect(isEmpty({ a: 1 })).to.be.false;
      });

      it('when given an empty array', () => {
        expect(isEmpty([1])).to.be.false;
      });
    });
  });

  describe('.isObject', () => {
    it('returns true when value is an object', () => {
      expect(isObject({})).to.be.true;
    });

    it('returns true when value is an array', () => {
      expect(isObject([])).to.be.true;
    });

    forEach([
      ['int', 1],
      ['string', 'a'],
      ['boolean', true],
      ['null', null],
      ['undefined', undefined],
      ['function', () => ({})],
    ]).it('returns false when value is of type: %s', (type, value) => {
      expect(isObject(value)).to.be.false;
    });
  });
});

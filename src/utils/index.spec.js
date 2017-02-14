import { expect } from 'chai';
import forEach from 'mocha-each';

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
    ]).it('returns true when given a date object of %s', (date) => {
      expect(isDate(date)).to.be.true;
    });

    forEach([
      [100],
      ['100'],
      [false],
      [{ a: 100 }],
      [[100, 101, 102]],
      [Date.parse('2016')],
      [Date.now()],
    ]).it('returns false when not given a date object of %s', (x) => {
      expect(isDate(x)).to.be.false;
    });
  });

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

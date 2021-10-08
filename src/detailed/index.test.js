import _ from "lodash"
import detailedDiff from './';
import { isObject } from "../utils"

function recursiveAddAfterBefore(object, lhs, rhs) {
  for (const key in object) {
    if (isObject(object[key])) {
      object[key] = recursiveAddAfterBefore(object[key], lhs[key], rhs[key])
    } else {
      object[key] = {
        before: lhs && lhs[key],
        after: rhs && rhs[key]
      }
    }
  }
  return object
}

describe('.detailedDiff', () => {

  describe('base case', () => {
    describe('equal', () => {
      test.each([
        ['int', 1],
        ['string', 'a'],
        ['boolean', true],
        ['null', null],
        ['undefined', undefined],
        ['object', { a: 1 }],
        ['array', [1]],
        ['function', () => ({})],
        ['date', new Date()],
        ['date with milliseconds', new Date('2017-01-01T00:00:00.637Z')],
      ])('returns empty object when given values of type %s are equal', (type, value) => {
        expect(detailedDiff(value, value)).toEqual({ "added": {}, "deleted": {}, "updated": {} });
      });
    });

    describe('not equal and not object', () => {
      test.each([
        [1, 2],
        ['a', 'b'],
        [true, false],
        ['hello', null],
        ['hello', undefined],
        [null, undefined],
        [undefined, null],
        [null, { a: 1 }],
        [{ a: 1 }, null],
        ['872983', { areaCode: '+44', number: '872983' }],
        [100, () => ({})],
        [() => ({}), 100],
        [new Date('2017-01-01'), new Date('2017-01-02')],
        [new Date('2017-01-01T00:00:00.636Z'), new Date('2017-01-01T00:00:00.637Z')],
      ])('returns right hand side value when different to left hand side value (%s, %s)', (lhs, rhs) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": {}, "deleted": {}, "updated": rhs });
      });
    });

    describe('added basic type', () => {
      test.each([
        [{}, { a: 2 }],
        [{}, { a: 'b' }],
        [{}, { a: false }],
        [{}, { a: () => ({}) }],
      ])('returns difference of right hand side value when different to left hand side value (%s, %s)', (lhs, rhs) => {
        const obj = recursiveAddAfterBefore(_.cloneDeep(rhs), lhs, rhs)
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": obj, "deleted": {}, "updated": {} });
      });
    });

    describe('delete basic type', () => {
      test.each([
        [{ a: 2 }, {}],
        [{ a: 'b' }, {}],
        [{ a: false }, {}],
        [{ a: () => ({}) }, {}],
      ])('returns difference of right hand side value when different to left hand side value (%s, %s)', (lhs, rhs) => {
        const obj = recursiveAddAfterBefore(_.cloneDeep(lhs), lhs, rhs)
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": {}, "deleted": obj, "updated": {} });
      });
    });

    describe('update basic type', () => {
      test.each([
        [{ a: 2 }, { a: 3 }],
        [{ a: 'b' }, { a: 'c' }],
        [{ a: false }, { a: true }],
        [{ a: () => ({}) }, { a: () => ({ test: true }) }],
      ])('returns difference of right hand side value when different to left hand side value (%s, %s)', (lhs, rhs) => {
        const obj = {}
        for (const key in lhs) {
          obj[key] = {
            before: lhs[key],
            after: rhs[key]
          }
        }
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": {}, "deleted": {}, "updated": obj });
      });
    });

    describe('add deep object', () => {
      test.each([
        [{}, { a: { a: 2 } }],
        [{}, { a: { a: 'b' } }],
        [{}, { a: { a: false } }],
        [{}, { a: { areaCode: '+44', number: '872983' } }],
        [{}, { a: { a: () => ({}) } }],
      ])('returns difference of right hand side in deepest path when different to left hand side value (%s, %s)', (lhs, rhs) => {
        const obj = recursiveAddAfterBefore(_.cloneDeep(rhs), lhs, rhs)
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": obj, "deleted": {}, "updated": {} });
      });
    });

    describe('delete deep object', () => {
      test.each([
        [{ a: { a: 2 } }, {}],
        [{ a: { a: 'b' } }, {}],
        [{ a: { a: false } }, {}],
        [{ a: { areaCode: '+44', number: '872983' } }, {}],
        [{ a: { a: () => ({}) } }, {}],
      ])('returns difference of right hand side in deepest path when different to left hand side value (%s, %s)', (lhs, rhs) => {
        const obj = recursiveAddAfterBefore(_.cloneDeep(lhs), lhs, rhs)
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": {}, "deleted": obj, "updated": {} });
      });
    });

    describe('update deep object', () => {
      test.each([
        [{ a: { a: 2 } }, { a: { a: 3 } }],
        [{ a: { a: 'b' } }, { a: { a: 'c' } }],
        [{ a: { a: false } }, { a: { a: true } }],
        [{ a: { areaCode: '+44', number: '872983' } }, { a: { areaCode: '+45', number: '872984' } }],
        [{ a: { a: () => ({}) } }, { a: { a: () => ({ a: true }) } }],
      ])('returns difference of right hand side in deepest path when different to left hand side value (%s, %s)', (lhs, rhs) => {
        const obj = recursiveAddAfterBefore(_.cloneDeep(lhs), lhs, rhs)
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": {}, "deleted": {}, "updated": obj });
      });
    });

    test('Add new field in deep object (difference in deepest path)', () => {
      expect(detailedDiff({ a: { a: 2 } }, { a: { a: 2, b: 2 } })).toEqual({ "added": { a: { b: { after: 2 } } }, "deleted": {}, "updated": {} });
    })

    test('Remove field in deep object (difference in deepest path)', () => {
      expect(detailedDiff({ a: { a: 2, b: 2 } }, { a: { a: 2 } })).toEqual({ "added": {}, "deleted": { a: { b: { before: 2 } } }, "updated": {} });
    })

    test('Remove field and add field in deep object (difference in deepest path)', () => {
      expect(detailedDiff({ a: { a: 2, b: 2 } }, { a: { a: 2, c: 3 } })).toEqual({ "added": { a: { c: { after: 3 } } }, "deleted": { a: { b: { before: 2 } } }, "updated": {} });
    })

    describe('add array *field*', () => {
      test.each([
        [{}, { a: ["a", "b"] }],
      ])('returns right hand side value when different to left hand side value (%s, %s)', (lhs, rhs) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": { a: { after: ["a", "b"] } }, "deleted": {}, "updated": {} });
      });
    });

    describe('add array *element*', () => {
      test.each([
        [{ a: ["a"] }, { a: ["a", "b"] }, [1]],
        [{ a: ["a"] }, { a: ["a", "b", "b"] }, [1, 2]],
        [{ a: ["a"] }, { a: ["a", "b", "b", "b"] }, [1, 2, 3]],
        [{ a: ["a"] }, { a: ["b", "a", "b", "b"] }, [0, 2, 3]],
      ])('returns inserted array element content and position of right hand side (%s, %s)', (lhs, rhs, indexes) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": { a: { after: [{ content: "b", index: indexes }] } }, "deleted": {}, "updated": {} });
      });
    });

    describe('remove array element', () => {
      test.each([
        [{ a: ["a", "b"] }, { a: ["a"] }, [1]],
        [{ a: ["a", "b", "b"] }, { a: ["a"] }, [1, 2]],
        [{ a: ["a", "b", "b", "b"] }, { a: ["a"] }, [1, 2, 3]],
        [{ a: ["b", "a", "b", "b"] }, { a: ["a"] }, [0, 2, 3]],
      ])('returns removed array element content and position of right hand side (%s, %s)', (lhs, rhs, indexes) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": {}, "deleted": { a: { before: [{ content: "b", index: indexes }] } }, "updated": {} });
      });
    });

    describe('change array field (pull one insert one)', () => {
      test.each([
        [{ a: ["a", "c"] }, { a: ["a", "b"] }],
      ])('returns inserted and removed array element of right hand side (%s, %s)', (lhs, rhs) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": { a: { after: [{ content: "b", index: [1] }] } }, "deleted": { a: { before: [{ content: "c", index: [1] }] } }, "updated": {} });
      });
    });
  });


  describe('complicated case', () => {
    describe('add array *element* not in root', () => {
      test.each([
        [{ a: { a: ["a"] } }, { a: { a: ["a", "b"] } }, [1]],
        [{ a: { a: ["a"] } }, { a: { a: ["a", "b", "b"] } }, [1, 2]],
        [{ a: { a: ["a"] } }, { a: { a: ["a", "b", "b", "b"] } }, [1, 2, 3]],
        [{ a: { a: ["a"] } }, { a: { a: ["b", "a", "b", "b"] } }, [0, 2, 3]],
      ])('returns inserted array element content and position of right hand side (%s, %s)', (lhs, rhs, indexes) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": { a: { a: { after: [{ content: "b", index: indexes }] } } }, "deleted": {}, "updated": {} });
      });
    });

    describe('remove array element not in root', () => {
      test.each([
        [{ a: { a: ["a", "b"] } }, { a: { a: ["a"] } }, [1]],
        [{ a: { a: ["a", "b", "b"] } }, { a: { a: ["a"] } }, [1, 2]],
        [{ a: { a: ["a", "b", "b", "b"] } }, { a: { a: ["a"] } }, [1, 2, 3]],
        [{ a: { a: ["b", "a", "b", "b"] } }, { a: { a: ["a"] } }, [0, 2, 3]],
      ])('returns removed array element content and position of right hand side (%s, %s)', (lhs, rhs, indexes) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": {}, "deleted": { a: { a: { before: [{ content: "b", index: indexes }] } } }, "updated": {} });
      });
    });

    describe('change array field (pull one insert one) not in root', () => {
      test.each([
        [{ a: { a: ["a", "c"] } }, { a: { a: ["a", "b"] } }],
      ])('returns inserted and removed array element of right hand side (%s, %s)', (lhs, rhs) => {
        expect(detailedDiff(lhs, rhs)).toEqual({ "added": { a: { a: { after: [{ content: "b", index: [1] }] } } }, "deleted": { a: { a: { before: [{ content: "c", index: [1] }] } } }, "updated": {} });
      });
    });
  });
});

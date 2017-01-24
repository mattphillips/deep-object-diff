# Deep Object Diff

[![Build Status](https://travis-ci.org/mattphillips/deep-object-diff.svg?branch=master)](https://travis-ci.org/mattphillips/deep-object-diff)
[![Coverage Status](https://coveralls.io/repos/github/mattphillips/deep-object-diff/badge.svg?branch=master)](https://coveralls.io/github/mattphillips/deep-object-diff?branch=master)

A small library that will deep diff two JavaScript Objects, including nested structures of arrays and objects, and return the difference.

### Useage:
```js
const lhs = {
  foo: {
    bar: {
      a: [1, 2],
      b: 2,
      c: ['x', 'y'],
      e: 100 // deleted
    }
  },
  buzz: 'world'
};

const rhs = {
  foo: {
    bar: {
      a: [1], // updated (value deleted)
      b: 2, // unchanged
      c: ['x', 'y', 'z'], // updated (value added)
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

console.log(diff(lhs, rhs));

/* logs:
{
  foo: {
    bar: {
      a: {
        '1': undefined
      },
      c: {
        '2': 'z'
      },
      d: 'Hello, world!',
      e: undefined
    }
  },
  buzz: 'fizz'
}
*/
```

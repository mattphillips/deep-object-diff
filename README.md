# Deep Object Diff

[![npm version](https://badge.fury.io/js/deep-object-diff.svg)](https://badge.fury.io/js/deep-object-diff)
[![Build Status](https://travis-ci.org/mattphillips/deep-object-diff.svg?branch=master)](https://travis-ci.org/mattphillips/deep-object-diff)
[![Coverage Status](https://coveralls.io/repos/github/mattphillips/deep-object-diff/badge.svg?branch=master)](https://coveralls.io/github/mattphillips/deep-object-diff?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/mattphillips/deep-object-diff.svg)](https://greenkeeper.io/)

A small library that can deep diff two JavaScript Objects, including nested structures of arrays and objects.

## Installation
`yarn add deep-object-diff`

`npm i --save deep-object-diff`

## Functions available:
 - [`diff(originalObj, updatedObj)`](#diff)
 returns the difference of the original and updated objects

 - [`addedDiff(original, updatedObj)`](#addeddiff)
 returns only the values added to the updated object

 - [`deletedDiff(original, updatedObj)`](#deleteddiff)
 returns only the values deleted in the updated object

 - [`updatedDiff(original, updatedObj)`](#updateddiff)
 returns only the values that have been changed in the updated object

 - [`detailedDiff(original, updatedObj)`](#detaileddiff)
 returns an object with the added, deleted and updated differences

## Importing

ES6 / Babel:
``` js
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
```

ES5:
``` js
const { diff, addedDiff, deletedDiff, detailedDiff, updatedDiff } = require("deep-object-diff");

// OR

const diff = require("deep-object-diff").diff;
const addedDiff = require("deep-object-diff").addedDiff;
const deletedDiff = require("deep-object-diff").deletedDiff;
const detailedDiff = require("deep-object-diff").detailedDiff;
const updatedDiff = require("deep-object-diff").updatedDiff;
```

## Usage:

### `diff`:
```js
const lhs = {
  foo: {
    bar: {
      a: ['a', 'b'],
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
      a: ['a'], // index 1 ('b')  deleted
      b: 2, // unchanged
      c: ['x', 'y', 'z'], // 'z' added
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

console.log(diff(lhs, rhs)); // =>
/*
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

### `addedDiff`:
```js
const lhs = {
  foo: {
    bar: {
      a: ['a', 'b'],
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
      a: ['a'], // index 1 ('b')  deleted
      b: 2, // unchanged
      c: ['x', 'y', 'z'], // 'z' added
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

console.log(addedDiff(lhs, rhs));

/*
{
  foo: {
    bar: {
      c: {
        '2': 'z'
      },
      d: 'Hello, world!'
    }
  }
}
*/
```

### `deletedDiff`:
```js
const lhs = {
  foo: {
    bar: {
      a: ['a', 'b'],
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
      a: ['a'], // index 1 ('b')  deleted
      b: 2, // unchanged
      c: ['x', 'y', 'z'], // 'z' added
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

console.log(deletedDiff(lhs, rhs));

/*
{
  foo: {
    bar: {
      a: {
        '1': undefined
      },
      e: undefined
    }
  }
}
*/
```

### `updatedDiff`:
```js
const lhs = {
  foo: {
    bar: {
      a: ['a', 'b'],
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
      a: ['a'], // index 1 ('b')  deleted
      b: 2, // unchanged
      c: ['x', 'y', 'z'], // 'z' added
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

console.log(updatedDiff(lhs, rhs));

/*
{
  buzz: 'fizz'
}
*/
```

### `detailedDiff`:
```js
const lhs = {
  foo: {
    bar: {
      a: ['a', 'b'],
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
      a: ['a'], // index 1 ('b')  deleted
      b: 2, // unchanged
      c: ['x', 'y', 'z'], // 'z' added
      d: 'Hello, world!' // added
    }
  },
  buzz: 'fizz' // updated
};

console.log(detailedDiff(lhs, rhs));

/*
{
  added: {
    foo: {
      bar: {
        c: {
          '2': 'z'
        },
        d: 'Hello, world!'
      }
    }
  },
  deleted: {
    foo: {
      bar: {
        a: {
          '1': undefined
        },
        e: undefined
      }
    }
  },
  updated: {
    buzz: 'fizz'
  }
}
*/
```


## License

MIT

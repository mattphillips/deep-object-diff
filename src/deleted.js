import { isEmpty, isObject, hasOwnProperty, makeObjectWithoutPrototype } from './utils.js';

const deletedDiff = (lhs, rhs) => {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  return Object.keys(lhs).reduce((acc, key) => {
    if (hasOwnProperty(rhs, key)) {
      const difference = deletedDiff(lhs[key], rhs[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      acc[key] = difference;
      return acc;
    }

    acc[key] = lhs[key];
    return acc;
  }, makeObjectWithoutPrototype());
};

export default deletedDiff;

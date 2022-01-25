import { isEmpty, isObject, hasOwnProperty } from './utils.js';

const addedDiff = (lhs, rhs) => {

  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = lhs;
  const r = rhs;

  return Object.keys(r).reduce((acc, key) => {
    if (hasOwnProperty(l, key)) {
      const difference = addedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      acc[key] = difference;
      return acc;
    }

    acc[key] = r[key];
    return acc;
  }, {});
};

export default addedDiff;

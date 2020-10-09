import { isEmpty, isObject, hasOwnProperty } from '../utils';

const addedDiff = (lhs, rhs) => {

  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = lhs;
  const r = rhs;

  return Object.keys(r).reduce((acc, key) => {
    if (hasOwnProperty(l, key)) {
      const difference = addedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: r[key] };
  }, {});
};

export default addedDiff;

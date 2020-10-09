import { isEmpty, isObject, hasOwnProperty } from '../utils';

const deletedDiff = (lhs, rhs) => {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = lhs;
  const r = rhs;

  return Object.keys(l).reduce((acc, key) => {
    if (hasOwnProperty(r, key)) {
      const difference = deletedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: undefined };
  }, {});
};

export default deletedDiff;

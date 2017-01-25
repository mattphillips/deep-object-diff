import { isEmpty, isObject } from '../utils';

const deletedDiff = (lhs, rhs) => {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  return Object.keys(lhs).reduce((acc, key) => {
    if (rhs.hasOwnProperty(key)) {
      const difference = deletedDiff(lhs[key], rhs[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: undefined };
  }, {});
};

export default deletedDiff;

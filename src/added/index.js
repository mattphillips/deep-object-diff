import { isEmpty, isObject } from '../utils';

const addedDiff = (lhs, rhs) => {

  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  return Object.keys(rhs).reduce((acc, key) => {
    if (lhs.hasOwnProperty(key)) {
      const difference = addedDiff(lhs[key], rhs[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: rhs[key] };
  }, {});
};

export default addedDiff;

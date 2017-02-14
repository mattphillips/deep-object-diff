import { isDate, isEmpty, isObject } from '../utils';

const updatedDiff = (lhs, rhs) => {

  if (lhs === rhs) return {};

  if (!isObject(lhs) || !isObject(rhs)) return rhs;

  if (isDate(lhs) || isDate(rhs)) {
    if (lhs.toString() == rhs.toString()) return {};
    return rhs;
  }

  return Object.keys(rhs).reduce((acc, key) => {

    if (lhs.hasOwnProperty(key)) {
      const difference = updatedDiff(lhs[key], rhs[key]);

      if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return acc;
  }, {});
};

export default updatedDiff;

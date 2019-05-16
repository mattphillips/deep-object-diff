import { isDate, isEmpty, isObject, properObject, isNumber } from '../utils';

const diff = (lhs, rhs, options = {}) => {
  if (lhs === rhs) return {}; // equal return no diff

  if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

  const l = properObject(lhs);
  const r = properObject(rhs);

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  if (isNumber(options.depth)) {
    if (options.depth === 0) {
      return r
    }
    options.depth -= 1
  }

  const deletedValues = Object.keys(l).reduce((acc, key) => {
    return r.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
  }, {});

  return Object.keys(r).reduce((acc, key) => {
    if (!l.hasOwnProperty(key)) return { ...acc, [key]: r[key] }; // return added r key

    const difference = diff(l[key], r[key], options);

    if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc; // return no diff

    return { ...acc, [key]: difference }; // return updated key
  }, deletedValues);
};

export default diff;

import { isDate, isEmptyObject, isObject, hasOwnProperty } from './utils.js';

const diff = (lhs, rhs) => {
  if (lhs === rhs) return {}; // equal return no diff

  if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

  const l = lhs;
  const r = rhs;

  const deletedValues = Object.keys(l).reduce((acc, key) => {
    if (!hasOwnProperty(r, key)) {
      acc[key] = undefined;
      
    }

    return acc;
  }, {});

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  return Object.keys(r).reduce((acc, key) => {
    if (!hasOwnProperty(l, key)){
      acc[key] = r[key]; // return added r key
      return acc;
    } 

    const difference = diff(l[key], r[key]);

    // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object
    if (isEmptyObject(difference) && !isDate(difference) && (isEmptyObject(l[key]) || !isEmptyObject(r[key])))
      return acc; // return no diff

    acc[key] = difference // return updated key
    return acc; // return updated key
  }, deletedValues);
};

export default diff;

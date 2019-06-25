import { isDate, isEmpty, isObject, properObject } from '../utils';

const diff = (lhs, rhs) => {
  if (lhs === rhs) return {}; // equal return no diff

  if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

  const l = properObject(lhs);
  const r = properObject(rhs);

  let changes = {}

  const lKeys = Object.keys(l)

  for (let i = 0; i < lKeys.length; i++) {
    const key = lKeys[i]

    if (!r.hasOwnProperty(key)) {
      changes[key] = undefined
    }
  }


  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  if (Array.isArray(r) && Array.isArray(l)) {
    const deletedValues = l.reduce((acc, item, index) => {
      return r.hasOwnProperty(index) ? acc.concat(item) : acc.concat(undefined);
    }, []);

    return r.reduce((acc, rightItem, index) => {
      if (!deletedValues.hasOwnProperty(index)) {
        return acc.concat(rightItem);
      }

      const leftItem = l[index];
      const difference = diff(rightItem, leftItem);

      if (isObject(difference) && isEmpty(difference) && !isDate(difference)) {
        delete acc[index];
        return acc; // return no diff
      }

      return acc.slice(0, index).concat(rightItem).concat(acc.slice(index + 1)); // return updated key
    }, deletedValues);
  }

  const rKeys = Object.keys(r)

  for (let i = 0; i < rKeys.length; i++) {
    const key = rKeys[i]

    if (!l.hasOwnProperty(key)) {
      changes[key] = r[key]
      continue;
    }

    const difference = diff(l[key], r[key]);

    if (isObject(difference) && isEmpty(difference) && !isDate(difference)) continue; // return no diff

    changes[key] = difference
  }

  return changes
};

export default diff;

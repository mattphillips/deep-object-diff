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

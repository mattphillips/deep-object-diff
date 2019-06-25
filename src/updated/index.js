import { isDate, isEmpty, isObject, properObject } from '../utils';

const updatedDiff = (lhs, rhs) => {

  if (lhs === rhs) return {};

  if (!isObject(lhs) || !isObject(rhs)) return rhs;

  const l = properObject(lhs);
  const r = properObject(rhs);

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }


  let changes = {}

  const rKeys = Object.keys(r)

  for (let i = 0; i < rKeys.length; i++){
    const key = rKeys[i]

    if (!l.hasOwnProperty(key)) continue

    const difference = updatedDiff(l[key], r[key]);

    if (isObject(difference) && isEmpty(difference) && !isDate(difference)) continue;

    changes[key] = difference

  }

  return changes
};

export default updatedDiff;

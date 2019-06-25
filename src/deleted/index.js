import { isEmpty, isObject, properObject } from '../utils';

const deletedDiff = (lhs, rhs) => {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = properObject(lhs);
  const r = properObject(rhs);

  let changes = {}

  const lKeys = Object.keys(l)

  for (let i = 0; i < lKeys.length; i++) {
    const key = lKeys[i]

    if (!r.hasOwnProperty(key)) {
      changes[key] = undefined
      continue
    }
    const difference = deletedDiff(l[key], r[key]);

    if (isObject(difference) && isEmpty(difference)) continue;
    
    changes[key] = difference
  }

  return changes
};

export default deletedDiff;

import { isEmpty, isObject, properObject } from '../utils';

const addedDiff = (lhs, rhs) => {

  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = properObject(lhs);
  const r = properObject(rhs);

  let changes = {}

  const rKeys = Object.keys(r)

  for (let i = 0; i < rKeys.length; i++) {
    const key = rKeys[i]

    if (!l.hasOwnProperty(key)) {
      changes[key] = r[key]
      continue
    }
    const difference = addedDiff(l[key], r[key]);

    if (isObject(difference) && isEmpty(difference)) continue;

    changes[key] = difference
  }

  return changes
};

export default addedDiff;

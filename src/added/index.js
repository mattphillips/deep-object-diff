import { isEmpty, isObject, properObject } from '../utils';

const addedDiff = (lhs, rhs) => {

  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = properObject(lhs);
  const r = properObject(rhs);

  return Object.keys(r).reduce((acc, key) => {
    if (l.hasOwnProperty(key)) {
      const difference = addedDiff(l[key], r[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }
    if (typeof r[key] === "object" && l[key] === undefined) {
      const difference = addedDiff({}, r[key]);
      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: { after: r[key] } };
  }, {});
};

export default addedDiff;

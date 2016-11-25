import isEqual from 'lodash/fp/isEqual';

const diff = (lhs, rhs) => {
  if (isEqual(lhs, rhs)) return {};

  if (typeof rhs !== 'object' || rhs === null) return rhs;

  return Object.keys(rhs).reduce((acc, key) => {
    if (!lhs.hasOwnProperty(key)) return { ...acc, [key]: rhs[key] };

    const lhsValue = lhs[key];
    const rhsValue = rhs[key];
    if (isEqual(lhsValue, rhsValue)) return acc;

    return { ...acc, [key]: diff(lhsValue, rhsValue) };
  }, {});
};

export default diff;
import isEqual from 'lodash/fp/isEqual';

const diff = (lhs, rhs) => {
  if (isEqual(lhs, rhs)) return {};

  if (typeof rhs !== 'object' || rhs === null) return rhs;

  return Object.keys(rhs).map(key => {
    if (!lhs.hasOwnProperty(key)) return { [key]: rhs[key] };

    const lhsValue = lhs[key];
    const rhsValue = rhs[key];
    if (isEqual(lhsValue, rhsValue)) return {};

    return { [key]: diff(lhsValue, rhsValue) };
  }).reduce((acc, next) => ({ ...acc, ...next }), {});
};

export default diff;
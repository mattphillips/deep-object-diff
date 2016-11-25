import isEqual from 'lodash/fp/isEqual';

const diff = (lhs, rhs) => {
  if (isEqual(lhs, rhs)) return {};

  if (typeof rhs !== 'object' || rhs === null) return rhs;

  const rhsKeys = Object.keys(rhs);

  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    return rhsKeys.indexOf(key) !== -1 ? acc : { ...acc, [key]: undefined };
  }, {});

  return rhsKeys.reduce((acc, key) => {
    if (!lhs.hasOwnProperty(key)) return { ...acc, [key]: rhs[key] };

    const lhsValue = lhs[key];
    const rhsValue = rhs[key];
    if (isEqual(lhsValue, rhsValue)) return acc;

    return { ...acc, [key]: diff(lhsValue, rhsValue) };
  }, deletedValues);
};

export default diff;
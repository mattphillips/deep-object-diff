const isObject = o => typeof o === 'object';
const isEmpty = o => Object.keys(o).length === 0;

const diff = (lhs, rhs) => {
  if (lhs === rhs) return {};

  if (!isObject(lhs) || !isObject(rhs) || rhs === null || lhs === null) return rhs;

  const rhsKeys = Object.keys(rhs);

  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    return rhsKeys.indexOf(key) !== -1 ? acc : { ...acc, [key]: undefined };
  }, {});

  return rhsKeys.reduce((acc, key) => {
    if (!lhs.hasOwnProperty(key)) return { ...acc, [key]: rhs[key] };

    const difference = diff(lhs[key], rhs[key]);

    if (isObject(difference) && isEmpty(difference)) return acc;

    return { ...acc, [key]: difference };
  }, deletedValues);
};

export default diff;
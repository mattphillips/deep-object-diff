const isObject = o => o != null && typeof o === 'object';
const isEmpty = o => Object.keys(o).length === 0;

const diff = (lhs, rhs) => {
  if (lhs === rhs) return {};

  if (!isObject(lhs) || !isObject(rhs)) return rhs;

  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    return rhs.hasOwnProperty(key) ? acc : { ...acc, [key]: undefined };
  }, {});

  return Object.keys(rhs).reduce((acc, key) => {
    if (!lhs.hasOwnProperty(key)) return { ...acc, [key]: rhs[key] };

    const difference = diff(lhs[key], rhs[key]);

    if (isObject(difference) && isEmpty(difference)) return acc;

    return { ...acc, [key]: difference };
  }, deletedValues);
};

export default diff;

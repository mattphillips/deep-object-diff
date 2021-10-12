import _ from "lodash"
import { isEmpty, isObject, properObject } from '../utils';

const addedDiff = (lhs, rhs, simpleArray = true) => {

  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  const l = properObject(lhs);
  const r = properObject(rhs);

  return Object.keys(r).reduce((acc, key) => {
    if (l.hasOwnProperty(key)) {
      if (Array.isArray(l[key]) && Array.isArray(r[key])) {
        const newFields = _.uniq(_.difference(r[key], l[key]))
        if (newFields.length === 0) {
          return acc
        }
        if (simpleArray) {
          return { ...acc, [key]: { after: _.uniq(_.difference(r[key], l[key])) } }
        }
        const newFieldsIndices = _.map(newFields, o => ({
          content: o,
          indices: []
        }))
        for (let i = 0; i < r[key].length; i++) {
          const index = _.findIndex(newFields, o => _.isEqual(o, r[key][i]))
          if (index !== -1) {
            newFieldsIndices[index].indices.push(i)
          }
        }
        return { ...acc, [key]: { after: newFieldsIndices } }
      }
      const difference = addedDiff(l[key], r[key], simpleArray);

      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }
    if (typeof r[key] === "object" && l[key] === undefined) {
      if (Array.isArray(r[key])) {
        return { ...acc, [key]: { after: r[key] } };
      }
      const difference = addedDiff({}, r[key]);
      if (isObject(difference) && isEmpty(difference)) return acc;

      return { ...acc, [key]: difference };
    }

    return { ...acc, [key]: { after: r[key] } };
  }, {});
};

export default addedDiff;

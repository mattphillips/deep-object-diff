import _ from "lodash"
import { isDate, isEmpty, isObject, properObject } from '../utils';

const updatedDiff = (lhs, rhs, simpleArray = true) => {

  if (lhs === rhs) return {};

  if (!isObject(lhs) || !isObject(rhs)) return rhs;

  const l = properObject(lhs);
  const r = properObject(rhs);

  if (isDate(l) || isDate(r)) {
    if (l.valueOf() == r.valueOf()) return {};
    return r;
  }

  return Object.keys(r).reduce((acc, key) => {

    if (l.hasOwnProperty(key)) {
      if (Array.isArray(l[key]) && Array.isArray(r[key])) {
        if (_.isEqual(l[key], r[key])) {
          return acc
        }
        const leftArray = _.cloneDeep(l[key])
        const rightArray = _.cloneDeep(r[key])
        const addedFields = _.uniq(_.difference(r[key], l[key]))
        const deletedFields = _.uniq(_.difference(l[key], r[key]))
        _.pullAll(leftArray, deletedFields)
        _.pullAll(rightArray, addedFields)
        if (_.isEqual(leftArray, rightArray) || simpleArray) {
          return acc
        } else {
          const allKeys = _.uniq(rightArray)
          const allKeysCounter = _.reduce(allKeys, (acc, curr) => (acc[curr] = 0, acc), {})
          const allKeysObject = _.reduce(allKeys, (acc, curr) => (acc[curr] = [], acc), {})
          for (let i = 0; i < leftArray.length; i++) {
            if (!_.isEqual(leftArray[i], rightArray[i])) {
              let index = _.findIndex(r[key], value => _.isEqual(value, rightArray[i]))
              for (let j = 0; j < allKeysCounter[rightArray[i]]; j++) {
                index = _.findIndex(r[key], value => _.isEqual(value, rightArray[i], index + 1))
              }
              allKeysObject[rightArray[i]].push({
                counter: allKeysCounter[rightArray[i]],
                newIndex: index
              })
            }
            allKeysCounter[rightArray[i]] = allKeysCounter[rightArray[i]]++
          }
          for (const key of Object.keys(allKeysObject)) {
            if (_.isEmpty(allKeysObject[key])) {
              delete allKeysObject[key]
            }
          }
          return { ...acc, [key]: { after: allKeysObject } }
        }
      }
      const difference = updatedDiff(l[key], r[key], simpleArray);

      if (isObject(difference) && isEmpty(difference) && !isDate(difference)) return acc;

      if ((isObject(difference) && !isDate) || isObject(l[key])) return { ...acc, [key]: difference }

      return { ...acc, [key]: { before: l[key], after: difference } };
    }

    return acc;
  }, {});
};

export default updatedDiff;

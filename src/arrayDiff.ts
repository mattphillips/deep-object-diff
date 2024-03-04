import type { DiffAddedType, DiffDeletedType, DiffUpdatedType } from "./types";
import { isDate, isEmpty, isObject, hasOwnProperty } from "./utils";

const diff = <T, U>(
    lhs: T,
    rhs: U
):
    | U
    | (DiffAddedType<T, U> & DiffDeletedType<T, U> & DiffUpdatedType<T, U>) => {
    if ((lhs as unknown) === (rhs as unknown)) return {}; // equal return no diff

    if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

    const deletedValues = Object.keys(lhs).reduce((acc, key) => {
        return hasOwnProperty(rhs, key) ? acc : { ...acc, [key]: undefined };
    }, {});

    if (isDate(lhs) || isDate(rhs)) {
        if (lhs.valueOf() == rhs.valueOf()) return {};
        return rhs;
    }

    if (Array.isArray(rhs) && Array.isArray(lhs)) {
        const deletedValues = lhs.reduce((acc, item, index) => {
            return hasOwnProperty(rhs, index)
                ? acc.concat(item)
                : acc.concat(undefined);
        }, []);

        return rhs.reduce((acc, rightItem, index) => {
            if (!hasOwnProperty(deletedValues, index)) {
                return acc.concat(rightItem);
            }

            const leftItem = lhs[index];
            const difference = diff(rightItem, leftItem);

            if (
                isObject(difference) &&
                isEmpty(difference) &&
                !isDate(difference)
            ) {
                delete acc[index];
                return acc; // return no diff
            }

            return acc
                .slice(0, index)
                .concat(rightItem)
                .concat(acc.slice(index + 1)); // return updated key
        }, deletedValues);
    }

    return Object.keys(rhs).reduce((acc, key) => {
        if (!hasOwnProperty(lhs, key))
            return { ...acc, [key]: (rhs as Record<string, unknown>)[key] }; // return added r key

        const difference = diff(
            (lhs as Record<string, unknown>)[key],
            (rhs as Record<string, unknown>)[key]
        );

        if (isObject(difference) && isEmpty(difference) && !isDate(difference))
            return acc; // return no diff

        return { ...acc, [key]: difference }; // return updated key
    }, deletedValues);
};

export default diff;

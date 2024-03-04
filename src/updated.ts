import type { DiffUpdatedType } from "./types";
import {
    isDate,
    isEmptyObject,
    isObject,
    hasOwnProperty,
    makeObjectWithoutPrototype,
} from "./utils";

const updatedDiff = <T, U>(lhs: T, rhs: U): DiffUpdatedType<T, U> => {
    if ((lhs as unknown) === (rhs as unknown)) return {};

    if (!isObject(lhs) || !isObject(rhs)) return rhs as DiffUpdatedType<T, U>;

    if (isDate(lhs) || isDate(rhs)) {
        if (lhs.valueOf() == rhs.valueOf()) return {};
        return rhs;
    }

    return Object.keys(rhs).reduce((acc, key) => {
        if (hasOwnProperty(lhs, key)) {
            const difference = updatedDiff(
                (lhs as Record<string, unknown>)[key],
                (rhs as Record<string, unknown>)[key]
            );

            // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object
            if (
                isEmptyObject(difference) &&
                !isDate(difference) &&
                (isEmptyObject((lhs as Record<string, unknown>)[key]) ||
                    !isEmptyObject((rhs as Record<string, unknown>)[key]))
            )
                return acc; // return no diff

            (acc as Record<string, unknown>)[key] = difference;
            return acc;
        }

        return acc;
    }, makeObjectWithoutPrototype() as DiffUpdatedType<T, U>);
};

export default updatedDiff;

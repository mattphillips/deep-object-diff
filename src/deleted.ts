import type { DiffDeletedType } from "./types";
import {
    isEmpty,
    isObject,
    hasOwnProperty,
    makeObjectWithoutPrototype,
} from "./utils";

const deletedDiff = <T, U>(lhs: T, rhs: U): DiffDeletedType<T, U> => {
    if (
        (lhs as unknown) === (rhs as unknown) ||
        !isObject(lhs) ||
        !isObject(rhs)
    )
        return {};

    return Object.keys(lhs).reduce((acc, key) => {
        if (hasOwnProperty(rhs, key)) {
            const difference = deletedDiff(
                (lhs as Record<string, unknown>)[key],
                (rhs as Record<string, unknown>)[key]
            );

            if (isObject(difference) && isEmpty(difference)) return acc;

            acc[key] = difference;
            return acc;
        }

        acc[key] = undefined;
        return acc;
    }, makeObjectWithoutPrototype()) as DiffDeletedType<T, U>;
};

export default deletedDiff;

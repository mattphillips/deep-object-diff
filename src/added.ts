import type { DiffAddedType } from "./types";
import {
    isEmpty,
    isObject,
    hasOwnProperty,
    makeObjectWithoutPrototype,
} from "./utils";

const addedDiff = <T, U>(lhs: T, rhs: U): DiffAddedType<T, U> => {
    if (
        (lhs as unknown) === (rhs as unknown) ||
        !isObject(lhs) ||
        !isObject(rhs)
    )
        return {} as DiffAddedType<T, U>;

    return Object.keys(rhs).reduce((acc, key) => {
        if (hasOwnProperty(lhs, key)) {
            const difference = addedDiff(
                (lhs as Record<string, unknown>)[key],
                (rhs as Record<string, unknown>)[key]
            );

            if (isObject(difference) && isEmpty(difference)) return acc;

            acc[key] = difference;
            return acc;
        }

        acc[key] = (rhs as Record<string, unknown>)[key];
        return acc;
    }, makeObjectWithoutPrototype()) as DiffAddedType<T, U>;
};

export default addedDiff;

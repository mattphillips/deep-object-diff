import type { DiffUpdatedType, DiffAddedType, DiffDeletedType } from "./types";
import {
    isDate,
    isEmptyObject,
    isObject,
    hasOwnProperty,
    makeObjectWithoutPrototype,
} from "./utils";

const diff = <T, U>(
    lhs: T,
    rhs: U
):
    | U
    | (DiffAddedType<T, U> & DiffDeletedType<T, U> & DiffUpdatedType<T, U>) => {
    if ((lhs as unknown) === (rhs as unknown)) return {}; // equal return no diff

    if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

    const deletedValues = Object.keys(lhs).reduce((acc, key) => {
        if (!hasOwnProperty(rhs, key)) {
            acc[key] = undefined;
        }

        return acc;
    }, makeObjectWithoutPrototype());

    if (isDate(lhs) || isDate(rhs)) {
        if (lhs.valueOf() == rhs.valueOf()) return {};
        return rhs;
    }

    return Object.keys(rhs).reduce((acc, key) => {
        if (!hasOwnProperty(lhs, key)) {
            acc[key] = (rhs as Record<string, unknown>)[key]; // return added r key
            return acc;
        }

        const difference = diff(
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

        acc[key] = difference; // return updated key
        return acc; // return updated key
    }, deletedValues) as DiffAddedType<T, U> &
        DiffDeletedType<T, U> &
        DiffUpdatedType<T, U>;
};

export default diff;

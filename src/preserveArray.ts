import type { DiffAddedType, DiffDeletedType, DiffUpdatedType } from "./types";
import { isObject, hasOwnProperty } from "./utils";

const getLargerArray = (l: unknown[], r: unknown[]) =>
    l.length > r.length ? l : r;

const preserve = <T, U>(
    diff: DiffAddedType<T, U> & DiffDeletedType<T, U> & DiffUpdatedType<T, U>,
    left: T,
    right: U
) => {
    if (!isObject(diff)) return diff;

    return Object.keys(diff).reduce((acc, key) => {
        const leftArray = (left as Record<string, unknown>)[key];
        const rightArray = (right as Record<string, unknown>)[key];

        if (Array.isArray(leftArray) && Array.isArray(rightArray)) {
            const array = [...getLargerArray(leftArray, rightArray)];
            return {
                ...acc,
                [key]: array.reduce(
                    (acc2: Record<PropertyKey, unknown>[], item, index) => {
                        if (
                            hasOwnProperty(
                                (diff as Record<string, unknown>)[key],
                                index
                            )
                        ) {
                            acc2[index] = preserve(
                                (diff as Record<string, unknown[]>)[key][index],
                                leftArray[index],
                                rightArray[index]
                            ); // diff recurse and check for nested arrays
                            return acc2;
                        }

                        delete acc2[index]; // no diff aka empty
                        return acc2;
                    },
                    array as Record<string, unknown>[]
                ),
            };
        }

        return {
            ...acc,
            [key]: (diff as Record<string, unknown>)[key],
        };
    }, {} as Record<string, unknown>);
};

export default preserve;

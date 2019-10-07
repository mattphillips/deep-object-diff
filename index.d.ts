type DeepPartial<T> = { 
    [K in keyof T]?: DeepPartial<T[K]> 
}

interface IDictionary<T> {
    [key: string]: T;
}

/* 
 In "deep-object-diff" there're 2 scenarios for a property diff:
    1. If the property is an object or primitive, the diff is a deep partial;
    2. If the property is an array, the diff is a dictionary. 
    Its keys are indices, and the values are deep partials of the change.
*/
type PropertyDiff<T> = T extends Array<infer Elem>
  ? IDictionary<Elem>
  : DeepPartial<T>;

export type Diff<T> = {
    [P in keyof T]?: PropertyDiff<T[P]>;
};

export interface IDetailedDiff<T> {
    added: Diff<T>;
    deleted: Diff<T>;
    updated: Diff<T>;
}

export function diff<T> (originalObj: T, updatedObj: T): Diff<T>

export function addedDiff<T> (originalObj: T, updatedObj: T): Diff<T>

export function deletedDiff<T> (originalObj: T, updatedObj: T): Diff<T>

export function updatedDiff<T> (originalObj: T, updatedObj: T): Diff<T>

export function detailedDiff<T> (originalObj: T, updatedObj: T): IDetailedDiff<T>

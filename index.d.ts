export function diff<T extends object>(originalObj: T, updatedObj: T): Partial<T>

export function addedDiff<T extends object>(originalObj: T, updatedObj: T): Partial<T>

export function deletedDiff<T extends object>(originalObj: T, updatedObj: T): Partial<T>

export function updatedDiff<T extends object>(originalObj: T, updatedObj: T): Partial<T>

export interface DetailedDiff<T extends object> {
    added: Partial<T>
    deleted: Partial<T>
    updated: Partial<T>
}

export function detailedDiff<T extends object>(originalObj: T, updatedObj: T): DetailedDiff<T>

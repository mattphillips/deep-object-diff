type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export function diff <T extends object, J extends object>(originalObj: T, updatedObj: J): DeepPartial<T & J>

export function addedDiff <T extends object, J extends object>(originalObj: T, updatedObj: J): DeepPartial<T & J>

export function deletedDiff <T extends object, J extends object>(originalObj: T, updatedObj: J): DeepPartial<T & J>

export function updatedDiff <T extends object, J extends object>(originalObj: T, updatedObj: J): DeepPartial<T & J>

export interface DetailedDiff<T extends object, J extends object> {
    added: DeepPartial<T & J>
    deleted: DeepPartial<T & J>
    updated: DeepPartial<T & J>
}

export function detailedDiff <T extends object, J extends object>(originalObj: T, updatedObj: J): DetailedDiff<T & J>

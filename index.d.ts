type Primitive = string | number | boolean | null | undefined;

export type Diff<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? { [key: string]: Diff<U> }
  : { [P in keyof T]?: Diff<T[P]> };

export type DiffRemovable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? { [key: string]: DiffRemovable<U | undefined> }
  : { [P in keyof T]?: DiffRemovable<T[P]> };

export function diff<T extends object>(
  originalObj: T,
  updatedObj: T,
): DiffRemovable<T>;

export function addedDiff<T extends object>(
  originalObj: T,
  updatedObj: T,
): Diff<T>;

export function deletedDiff<T extends object>(
  originalObj: T,
  updatedObj: T,
): DiffRemovable<T>;

export function updatedDiff<T extends object>(
  originalObj: T,
  updatedObj: T,
): Diff<T>;

export type DetailedDiff<T> = {
  added: Diff<T>;
  deleted: DiffRemovable<T>;
  updated: Diff<T>;
};

export function detailedDiff<T extends object>(
  originalObj: T,
  updatedObj: T,
): DetailedDiff<T>;

export type DiffDeletedType<T, U> =
    | {
          [P in Exclude<keyof T, keyof U>]: undefined;
      }
    | Record<string, never>;

export type DiffAddedType<T, U> =
    | {
          [P in Exclude<keyof U, keyof T>]: U[P];
      }
    | Record<string, never>;

export type DiffUpdatedType<T, U> =
    | {
          [P in keyof T & keyof U]?: DiffUpdatedType<T[P], U[P]>;
      }
    | Record<string, never>;

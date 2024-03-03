type ElementType<T> = T extends unknown[]
    ? T extends (infer U)[]
        ? U
        : never
    : T;

type EmptyObject = Record<string, never>;

export type DiffDeletedType<T, U> =
    | {
          [P in Exclude<keyof ElementType<T>, keyof ElementType<U>>]: undefined;
      }
    | EmptyObject;

export type DiffAddedType<T, U> =
    | {
          [P in Exclude<
              keyof ElementType<U>,
              keyof ElementType<T>
          >]: ElementType<U>[P];
      }
    | EmptyObject;

export type DiffUpdatedType<T, U> =
    | {
          [P in keyof ElementType<T> & keyof ElementType<U>]?: DiffUpdatedType<
              ElementType<T>[P],
              ElementType<U>[P]
          >;
      }
    | U
    | EmptyObject;

export type DiffType<T, U> =
    | U
    | (DiffAddedType<T, U> & DiffDeletedType<T, U> & DiffUpdatedType<T, U>);

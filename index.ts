type Diff<A> = {
  [Key in keyof A]?: A[Key] extends Array<infer U> ? Record<string, Diff<U>> : Diff<A[Key]>;
};

interface DetailedDiff<L, R> {
  added: AddedDiff<L, R>;
  deleted: DeletedDiff<L, R>;
  updated: UpdatedDiff<L, R>;
}

// Should return arrays as optional dictionaries with an optional keypath to the array as an item could have been added
// Should return any new keys with non-optional path to the new value
type AddedDiff<L, R> = {
  [Key in keyof R]: Key extends keyof L
    ? L[Key] extends R[Key]
      ? [L[Key], R[Key]] extends [Array<infer LU>, Array<infer RU>]
        ? Record<string, AddedDiff<LU, RU>> | undefined
        : [L[Key], R[Key]] extends [object, object]
        ? AddedDiff<L[Key], R[Key]> | undefined
        : never
      : AddedDiff<L[Key], R[Key]>
    : R[Key];
};

// Should return arrays as optional dictionaries with an optional keypath to the array as an item could have been removed
// Should return any deleted keys with non-optional path to the key
type DeletedDiff<L, R> = {
  [Key in keyof L]: Key extends keyof R
    ? R[Key] extends L[Key]
      ? [L[Key], R[Key]] extends [Array<infer LU>, Array<infer RU>]
        ? Record<string, DeletedDiff<LU, RU>> | undefined
        : [L[Key], R[Key]] extends [object, object]
        ? DeletedDiff<L[Key], R[Key]> | undefined
        : never
      : DeletedDiff<L[Key], R[Key]>
    : undefined;
};

// TODO: Implement this diff
type UpdatedDiff<L, R> = {};

declare function diff<L, R>(originalObj: L, updatedObj: R): Diff<L> & Diff<R>;

declare function addedDiff<L, R>(originalObj: L, updatedObj: R): AddedDiff<L, R>;

declare function deletedDiff<L, R>(originalObj: L, updatedObj: R): DeletedDiff<L, R>;

declare function updatedDiff<L, R>(originalObj: L, updatedObj: R): UpdatedDiff<L, R>;

declare function detailedDiff<L, R>(originalObj: L, updatedObj: R): DetailedDiff<L, R>;

// ----------------------------------------- Testing playground below

const lhs = {
  foo: {
    bar: {
      a: ["a", "b"],
      b: 2,
      c: ["x", "y"],
      e: 100, // deleted,
    },
  },
  buzz: "world",
  numberOrBoolean: 1,
  phillips: "name",
};
type LHS = typeof lhs;

const rhs = {
  foo: {
    bar: {
      a: ["a"], // index 1 ('b')  deleted
      b: 2, // unchanged
      c: ["x", "y", "z"], // 'z' added
      d: "Hello, world!", // added
    },
  },
  buzz: "fizz", // updated,
  numberOrBoolean: false,
  newlyadded: 1,
};
type RHS = typeof rhs;

const difference = diff(lhs, rhs);
// TODO: This shouldn't be undefined
difference.numberOrBoolean;

const added = addedDiff(lhs, rhs);
const deleted = deletedDiff(lhs, rhs);

// TODO: Test how this algo works for optionals keys on the left and matching optional/required keys on the right
type TestDiff = Diff<LHS | RHS>["foo"];
type TestAddedDiff = AddedDiff<LHS, RHS>;
type TestDeletedDiff = DeletedDiff<LHS, RHS>["foo"]["bar"];

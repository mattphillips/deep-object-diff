import type { DiffAddedType, DiffDeletedType, DiffUpdatedType } from "./types";
import addedDiff from "./added";
import deletedDiff from "./deleted";
import updatedDiff from "./updated";

const detailedDiff = <T, U>(
    lhs: T,
    rhs: U
): {
    added: DiffAddedType<T, U>;
    deleted: DiffDeletedType<T, U>;
    updated: DiffUpdatedType<T, U>;
} => ({
    added: addedDiff(lhs, rhs),
    deleted: deletedDiff(lhs, rhs),
    updated: updatedDiff(lhs, rhs),
});

export default detailedDiff;

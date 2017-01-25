import addedDiff from '../added';
import deletedDiff from '../deleted';
import updatedDiff from '../updated';

const detailedDiff = (lhs, rhs) => ({
  added: addedDiff(lhs, rhs),
  deleted: deletedDiff(lhs, rhs),
  updated: updatedDiff(lhs, rhs),
});

export default detailedDiff;

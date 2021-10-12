import addedDiff from '../added';
import deletedDiff from '../deleted';
import updatedDiff from '../updated';

const detailedDiff = (lhs, rhs, simpleArray = true) => ({
  added: addedDiff(lhs, rhs, simpleArray),
  deleted: deletedDiff(lhs, rhs, simpleArray),
  updated: updatedDiff(lhs, rhs, simpleArray),
});

export default detailedDiff;

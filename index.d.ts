interface Options {
  depth: number
}

export function diff (originalObj: object, updatedObj: object, options: Options): object

export function addedDiff (originalObj: object, updatedObj: object): object

export function deletedDiff (originalObj: object, updatedObj: object): object

export function updatedDiff (originalObj: object, updatedObj: object): object

export function detailedDiff (originalObj: object, updatedObj: object): object

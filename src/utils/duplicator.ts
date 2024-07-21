import { ObjectId } from 'mongodb';

export function hasDuplicates(array: ObjectId[]): boolean {
    const seen = new Set<string>();
    for (const id of array) {
        const idStr = id.toString();
        if (seen.has(idStr)) {
            return true;
        }
        seen.add(idStr);
    }
    return false;
}


export function areObjectIdArraysDisjoint(arr1: (ObjectId | string)[], arr2: (ObjectId | string)[]): boolean {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }

  // Convert strings to ObjectId if necessary and check if any ObjectId in arr1 exists in arr2
  for (const id1 of arr1) {
    const objectId1 = id1 instanceof ObjectId ? id1 : new ObjectId(id1);
    if (arr2.some(id2 => {
      const objectId2 = id2 instanceof ObjectId ? id2 : new ObjectId(id2);
      return objectId1.equals(objectId2);
    })) {
      return false;
    }
  }

  return true;
}
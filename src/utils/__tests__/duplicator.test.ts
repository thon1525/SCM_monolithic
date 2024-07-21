import { ObjectId } from 'mongodb'; // Adjust the import path as needed
import { areObjectIdArraysDisjoint, hasDuplicates } from '../duplicator';

describe('hasDuplicates function', () => {
  it('should return false for an empty array', () => {
    expect(hasDuplicates([])).toBe(false);
  });

  it('should return false for an array with no duplicates', () => {
    const array = [new ObjectId(), new ObjectId(), new ObjectId()];
    expect(hasDuplicates(array)).toBe(false);
  });

  it('should return true for an array with duplicates', () => {
    const id = new ObjectId();
    const array = [id, new ObjectId(), id];
    expect(hasDuplicates(array)).toBe(true);
  });

  it('should return false for an array with unique ObjectIds as strings', () => {
    const array = [new ObjectId().toString(), new ObjectId().toString(), new ObjectId().toString()];
    expect(hasDuplicates(array as any)).toBe(false);
  });

  it('should return true for an array with duplicate ObjectIds as strings', () => {
    const id = new ObjectId().toString();
    const array = [id, new ObjectId().toString(), id];
    expect(hasDuplicates(array as any)).toBe(true);
  });

  it('should handle mixed types gracefully', () => {
    const id1 = new ObjectId();
    const id2 = new ObjectId();
    const array = [id1, id1.toString(), id2, id2.toString()];
    expect(hasDuplicates(array as any)).toBe(true);
  });
});

describe('areObjectIdArraysDisjoint', () => {
  test('should return false if any ObjectId in arr1 exists in arr2', () => {
    const id1 = new ObjectId();
    const id2 = new ObjectId();
    const arr1 = [id1, id2];
    const arr2 = [id2.toHexString(), new ObjectId().toHexString()];

    expect(areObjectIdArraysDisjoint(arr1, arr2)).toBe(false);
  });

  test('should return true if no ObjectId in arr1 exists in arr2', () => {
    const arr1 = [new ObjectId(), new ObjectId()];
    const arr2 = [new ObjectId().toHexString(), new ObjectId().toHexString()];

    expect(areObjectIdArraysDisjoint(arr1, arr2)).toBe(true);
  });

  test('should return true if both arrays are empty', () => {
    const arr1: (ObjectId | string)[] = [];
    const arr2: (ObjectId | string)[] = [];

    expect(areObjectIdArraysDisjoint(arr1, arr2)).toBe(true);
  });

  test('should return false if arr1 is not an array', () => {
    const arr1: any = null;
    const arr2 = [new ObjectId().toHexString(), new ObjectId().toHexString()];

    expect(areObjectIdArraysDisjoint(arr1, arr2)).toBe(false);
  });

  test('should return false if arr2 is not an array', () => {
    const arr1 = [new ObjectId(), new ObjectId()];
    const arr2: any = null;

    expect(areObjectIdArraysDisjoint(arr1, arr2)).toBe(false);
  });

  test('should handle mixed ObjectId and string values in arrays', () => {
    const id1 = new ObjectId();
    const arr1 = [id1.toHexString(), new ObjectId()];
    const arr2 = [id1, new ObjectId().toHexString()];

    expect(areObjectIdArraysDisjoint(arr1, arr2)).toBe(false);
  });
});
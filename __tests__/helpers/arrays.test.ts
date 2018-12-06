import { add, insert, move, remove, replace, swap } from '../../src/helpers/arrays';

const array = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }];

describe('Arrays', () => {
  it('should add an element by means of the add operator', () => {
    const newElement = { id: '6' };
    const newArray = add(array, newElement);
    expect(newArray).toHaveLength(6);
    expect(newArray[5]).toEqual(newElement);
    for (let i = 0; i < 5; i++) {
      expect(newArray[i]).toEqual(array[i]);
    }
  });

  it('should insert an element by means of the insert operator', () => {
    const newElement = { id: '6' };
    const newArray = insert(array, 0, newElement);
    expect(newArray).toHaveLength(6);
    expect(newArray[0]).toEqual(newElement);
    for (let i = 0; i < 5; i++) {
      expect(newArray[i + 1]).toEqual(array[i]);
    }
  });

  it('should replace an element by means of the replace operator', () => {
    const newElement = { id: '6' };
    const newArray = replace(array, 0, newElement);
    expect(newArray).toHaveLength(5);
    expect(newArray[0]).toEqual(newElement);
    for (let i = 1; i < 5; i++) {
      expect(newArray[i]).toEqual(array[i]);
    }
  });

  it('should move an element by means of the move operator', () => {
    const newArray = move(array, 0, 2);
    expect(newArray).toHaveLength(5);
    expect(newArray[0]).toEqual(array[1]);
    expect(newArray[1]).toEqual(array[2]);
    expect(newArray[2]).toEqual(array[0]);
  });

  it('should swap an element by means of the swap operator', () => {
    const newArray = swap(array, 0, 2);
    expect(newArray).toHaveLength(5);
    expect(newArray[0]).toEqual(array[2]);
    expect(newArray[2]).toEqual(array[0]);
  });

  it('should remove an element by means of the remove operator', () => {
    let newArray = remove(array, array[0]);
    expect(newArray).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(newArray[i]).toEqual(array[i + 1]);
    }

    newArray = remove(array, 0);
    expect(newArray).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(newArray[i]).toEqual(array[i + 1]);
    }
  });
});

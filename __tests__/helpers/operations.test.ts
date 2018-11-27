import { get, set } from '../../src/helpers/operations';

const source = {
  address: {
    durationOfStay: {
      days: 2,
      years: 3,
    },
    street: 'unknown',
  },
  friends: [
    { name: 'K', enemies: [{ name: 'A'}] },
    { name: 'B' },
  ],
  name: 'Jovi',
};

describe('operations', () => {
  it('Should get the values', () => {
    expect(get(source, 'name')).toEqual('Jovi');
    expect(typeof get(source, 'address')).toEqual('object');
    expect(get(source, 'address.street')).toEqual('unknown');
    expect(get(source, 'friends')).toEqual(source.friends);
    expect(typeof get(source, 'friends[0]')).toEqual('object');
    expect(get(source, 'friends[0].name')).toEqual('K');
    expect(get(source, 'friends[1].name')).toEqual('B');
    // TODO: fails in toPath
    // expect(get(source, 'friends[1].enemies[0].name')).toEqual('A');
  });

  it('Should set the values', () => {
    // TODO:
  });
});

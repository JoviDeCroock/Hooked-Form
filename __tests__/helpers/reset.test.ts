import reset from '../../src/helpers/reset';

describe('Reset', () => {
  it('Reset string should return empty string', () => {
    const x = reset('xd');
    expect(x).toEqual('');
  });
  it('Reset number should return zero', () => {
    const x = reset(1);
    expect(x).toEqual(0);
  });
  it('Reset boolean should return false', () => {
    const x = reset(true);
    expect(x).toEqual(false);
  });
  it('Reset object should return object', () => {
    const x = reset({ rekt: true });
    expect(x).toEqual({});
  });
  it('Should reset a date', () => {
    const date = new Date();
    const x = reset(date);
    expect(x instanceof Date).toEqual(true);
  });

  it('Should reset an unknown to undefined', () => {
    const x = reset(() => {
      // do something
    });
    expect(x).toEqual(undefined);
  });
});

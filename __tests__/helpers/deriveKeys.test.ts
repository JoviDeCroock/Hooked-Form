import { deriveKeys } from '../../src/helpers/deriveKeys';

describe('deriveKeys', () => {
  it('should correctly derive keys', () => {
    const result = deriveKeys({ a: 'x', b: 'y' });
    expect(result).toEqual(['a', 'b']);
  });

  it('should correctly derive keys for nested objects', () => {
    const result = deriveKeys({ a: 'x', b: 'y', c: { x: 'y', d: { h: 'y' } } });
    expect(result).toEqual(['a', 'b', 'c.x', 'c.d.h']);
  });

  it('should correctly derive keys for arrays', () => {
    const result = deriveKeys({ a: 'x', b: 'y', e: [{ x: 'y', d: { h: 'y' } }], d: [{ freakz: 'hi' }] });
    expect(result).toEqual(['a', 'b', 'e[0].x', 'e[0].d.h', 'd[0].freakz']);
  });

  it('should correctly derive keys for arrays', () => {
    const result = deriveKeys({ a: 'x', b: 'y', e: ['y', 'x'], d: [{ freakz: ['hi'] }] });
    expect(result).toEqual(['a', 'b', 'e[0]', 'e[1]', 'd[0].freakz[0]']);
  });
});

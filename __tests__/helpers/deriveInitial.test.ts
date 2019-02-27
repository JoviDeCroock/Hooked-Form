import { deriveInitial } from "../../src/helpers/deriveInitial";

describe('deriveInitial', () => {
  it('Should derive initial for a flat object', () => {
    const source = {
      age: 22,
      name: 'Jovi',
    }
    const result = deriveInitial(source, false);
    expect(result).toEqual({ age: false, name: false })
  });

  it('Should derive initial for a nested object', () => {
    const source = {
      age: 22,
      hobby: {
        id: 2,
        name: 'Programming',
      },
      name: 'Jovi',
    }
    const result = deriveInitial(source, false);
    expect(result).toEqual({ age: false, name: false, hobby: { id: false, name: false } })
  });

  it('Should derive initial for a nested object with arrays', () => {
    const source = {
      age: 22,
      friends: [
        { id: 1, name: 'Liesse', hobby: { id: 2, name: 'architecture', } },
        { id: 2, name: 'Niels', hobby: { id: 3, name: 'working', } },
      ],
      hobby: {
        id: 2,
        name: 'Programming',
      },
      name: 'Jovi',
    }
    const result = deriveInitial(source, false);
    expect(result).toEqual({
      age: false,
      friends: [
        { id: false, name: false, hobby: { id: false, name: false } },
        { id: false, name: false, hobby: { id: false, name: false } },
      ],
      hobby: { id: false, name: false },
      name: false,
    })
  });
});

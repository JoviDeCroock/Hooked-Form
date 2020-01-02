import { useState } from 'preact/hooks';
import { set } from './operations';

type Output = [object, (id: string, value: any) => void, (newState: object) => void];

export default (initial: object | (() => object)): Output => {
  const data = useState(initial);
  return [
    data[0],
    (id: string, value: any) => {
      data[1](state => set(state, id, value));
    },
    (newState: object) => {
      data[1](newState);
    },
  ];
};

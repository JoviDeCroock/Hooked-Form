import * as React from 'react';
import { set } from './operations';
import { emit } from '../context/emitter';

export const EMPTY_OBJ = {};

type Output = [
  object,
  (id: string, value: any) => void,
  (newState?: object) => void
];

export default (initial?: object | (() => object)): Output => {
  const data = React.useState(initial || EMPTY_OBJ);
  return [
    data[0],
    (id: string, value: any) => {
      data[1](state => set(state, id, value));
      emit(id);
    },
    (newState?: object) => {
      data[1](newState || EMPTY_OBJ);
    },
  ];
};

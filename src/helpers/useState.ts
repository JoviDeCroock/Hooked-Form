import * as React from 'react';
import { set } from './operations';

type Output = [object, (id: string, value: any) => void, (newState: object) => void];

export default (initial: object | (() => object)): Output => {
  const { 0: values, 1: innerSetValue } = React.useState(initial);
  return [
    values,
    React.useCallback((id: string, value: any) => {
      innerSetValue(state => set(state, id, value));
    }, []),
    React.useCallback((newState: object) => {
      innerSetValue(newState);
    }, []),
  ];
};

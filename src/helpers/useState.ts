import * as React from 'react';
import { set } from './operations';

export default (initial: object = {}): [object, (id: string, value: any) => void, (newState: object) => void] => {
  const { 0: values, 1: innerSetValue } = React.useState(initial);
  const setValue = (id: string, value: any) => innerSetValue((state) => set(state, id, value));
  const setState = (newState: object) => innerSetValue(() => ({ ...newState }));
  return [values, setValue, setState];
};

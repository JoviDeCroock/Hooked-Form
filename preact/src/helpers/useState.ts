import { useState, useCallback } from 'preact/hooks';
import { set } from './operations';

type Output = [object, (id: string, value: any) => void, (newState: object) => void];

export default (initial: object): Output => {
  const { 0: values, 1: innerSetValue } = useState(initial || {});

  const setValue = useCallback((id: string, value: any) =>
    innerSetValue(state => set(state, id, value)), [innerSetValue]);

  const setState = useCallback((newState: object) =>
    innerSetValue(() => ({ ...newState })), [innerSetValue]);

  return [values, setValue, setState];
};

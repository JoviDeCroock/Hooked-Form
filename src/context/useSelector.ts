import * as React from 'react';
import { formContext } from '../helpers/context';
import { FormHookContext } from '../types';
import { keyword } from './createContext';

export const useSelector = (
  selector: (context: FormHookContext) => any,
) => {
  const listeners = (formContext as any)[keyword];

  const state = React.useReducer(c => !c, false);
  const value = React.useContext(formContext);
  const selected = selector(value as any);
  const ref = React.useRef<{ f?: (context: FormHookContext) => any, s?: any}>({});

  React.useLayoutEffect(() => {
    ref.current.f = selector;
    ref.current.s = selected;
  });

  React.useLayoutEffect(() => {
    const callback = (nextValue: any) => {
      // @ts-ignore
      if (ref.current.s !== ref.current.f(nextValue)) state[1]();
    };
    listeners.push(callback);
    return () => {
      listeners.splice(listeners.indexOf(callback), 1);
    };
  }, [listeners]);

  return selected;
};

import * as React from 'react';
import { FormHookContext } from '../types';
import { keyword } from './createContext';

export const useSelector = (
  context: React.Context<FormHookContext>,
  selector: (context: FormHookContext) => any,
) => {
  let listeners = (context as any)[keyword];

  const [, forceUpdate] = React.useReducer(c => !c, false);
  const value = React.useContext(context);
  const selected = selector(value as any);
  const ref = React.useRef<{ f?: (context: FormHookContext) => any, s?: any}>({});

  React.useLayoutEffect(() => {
    ref.current.f = selector;
    ref.current.s = selected;
  });

  React.useLayoutEffect(() => {
    const callback = (nextValue: any) => {
      try {
        // @ts-ignore
        if (ref.current.s === ref.current.f(nextValue)) return;
      // tslint:disable-next-line: no-empty
      } catch (e) {}
      // @ts-ignore
      forceUpdate();
    };
    listeners.push(callback);
    return () => {
      listeners = listeners.filter((cb: any) => cb !== callback);
    };
  }, [listeners]);

  return selected;
};

import * as React from 'react';
import { formContext } from './context/context';
import { on } from './context/emitter';
import { FormHookContext } from './types';

export default (optOut?: boolean): FormHookContext => {
  if (!optOut) {
    const state = React.useReducer(c => !c, false);
    on('all', () => {
      // @ts-ignore
      state[1]();
    });
  }
  return React.useContext(formContext);
};

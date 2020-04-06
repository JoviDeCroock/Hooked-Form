import * as React from 'react';
import { formContext } from './Form';
import { FormHookContext } from './types';

export const useContextEmitter = (fieldId: string) => {
  const state = React.useReducer(c => !c, false);
  const context = React.useContext<FormHookContext>(formContext);

  React.useEffect(() => {
    return context.on(fieldId, () => {
      state[1]();
    });
  }, [fieldId]);

  return context;
};

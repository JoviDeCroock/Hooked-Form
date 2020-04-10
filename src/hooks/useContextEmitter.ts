import * as React from 'react';
import { formContext } from '../Form';
import { FormHookContext, PrivateFormHookContext } from '../types';

export const useContextEmitter = (fieldId: string): FormHookContext => {
  const state = React.useReducer(c => !c, false);
  const context = React.useContext<FormHookContext>(formContext);

  React.useEffect(() => {
    return (context as PrivateFormHookContext)._on(fieldId, () => {
      state[1]();
    });
  }, [fieldId]);

  return context;
};

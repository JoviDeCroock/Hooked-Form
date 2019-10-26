import * as React from 'react';
import { on } from './context/emitter';
import { get } from './helpers/operations';
import { FormHookContext } from './types';
import { formContext } from './context/context';

export interface FieldInformation {
  error: string;
}

export default function useError(fieldId: string): string | null {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Error needs a valid "fieldId" property to function correctly.');
  }

  const state = React.useReducer(c => !c, false);
  React.useEffect(() => {
    on(
      fieldId,
      () => {
        // @ts-ignore
        state[1]();
      },
    );
  }, []);

  return get(React.useContext<FormHookContext>(formContext).errors, fieldId);
}

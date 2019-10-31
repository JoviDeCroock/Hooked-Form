import * as React from 'react';
import { on } from './context/emitter';
import { formContext } from './Form';
import { EMPTY_ARRAY } from './helpers/useState';
import { FormHookContext } from './types';

export const useContextEmitter = (fieldId: string | Array<string>) => {
  const state = React.useReducer(c => !c, false);
  React.useEffect(() => {
    return on(
      fieldId,
      () => {
        // @ts-ignore
        state[1]();
      },
    );
  }, EMPTY_ARRAY);
  return React.useContext<FormHookContext>(formContext);
};

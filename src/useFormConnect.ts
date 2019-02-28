import * as React from 'react';
import { formContext } from './helpers/context';
import { FormHookContext } from './types';

const useFormConnect = (): FormHookContext => {
  return React.useContext(formContext);
};

export default useFormConnect;

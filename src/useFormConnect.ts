import * as React from 'react';
import { formContext } from './Form';
import { FormHookContext } from './types';
import { useContextEmitter } from './useContextEmitter';

export default (optOut?: boolean): FormHookContext => {
  if (optOut) return React.useContext(formContext);
  return useContextEmitter('all');
};

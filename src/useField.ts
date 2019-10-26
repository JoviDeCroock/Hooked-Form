import * as React from 'react';
import { on } from './context/emitter';
import { get } from './helpers/operations';
import { formContext } from './context/context';
import { FormHookContext } from './types';

export interface FieldOperations<T> {
  onBlur: () => void;
  onChange: (value: T) => void;
  onFocus: () => void;
  setFieldValue: (fieldId: string, value: any) => void;
}

export interface FieldInformation<T> {
  error: string;
  touched: boolean;
  value: T;
}

export default function useField<T = any>(
  fieldId: string,
): [FieldOperations<T>, FieldInformation<T>] {
  // Dev-check
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Field needs a valid "fieldId" property to function correctly.');
  }
  const state = React.useReducer(c => !c, false);
  // Context
  const ctx = React.useContext<FormHookContext>(formContext);

  React.useEffect(() => {
    return on(
      fieldId,
      () => {
        // @ts-ignore
        state[1]();
      },
    );
  }, []);

  return [
    {
      onBlur: React.useCallback(() => {
        ctx.setFieldTouched(fieldId, true);
      }, []),
      onChange: React.useCallback((value: T) => {
        ctx.setFieldValue(fieldId, value);
      }, []),
      onFocus: React.useCallback(() => {
        ctx.setFieldTouched(fieldId, false);
      }, []),
      setFieldValue: ctx.setFieldValue,
    },
    {
      error: get(ctx.errors, fieldId),
      touched: get(ctx.touched, fieldId),
      value: get(ctx.values, fieldId) || '',
    },
  ];
}

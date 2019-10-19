import * as React from 'react';
import { useSelector } from './context/useSelector';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
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
  // Context
  const _ctx = React.useContext<FormHookContext>(formContext);

  return [
    {
      onBlur: React.useCallback(() => {
        _ctx.setFieldTouched(fieldId, true);
      }, []),
      onChange: React.useCallback((value: T) => {
        _ctx.setFieldValue(fieldId, value);
      }, []),
      onFocus: React.useCallback(() => {
        _ctx.setFieldTouched(fieldId, false);
      }, []),
      setFieldValue: _ctx.setFieldValue,
    },
    {
      error: useSelector(
        (ctx: FormHookContext) => get(ctx.errors, fieldId)),
      touched: useSelector(
        (ctx: FormHookContext) => get(ctx.touched, fieldId)),
      value: useSelector(
        (ctx: FormHookContext) => get(ctx.values, fieldId) || ''),
    },
  ];
}

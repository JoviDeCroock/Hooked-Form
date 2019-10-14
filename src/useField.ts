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
    throw new Error('The Field needs a valid "fieldId" property to  function correctly.');
  }
  // Context
  const { setFieldValue, setFieldTouched } = React.useContext(formContext);

  return [
    {
      onBlur: React.useCallback(() => {
        setFieldTouched(fieldId, true);
      }, []),
      onChange: React.useCallback((value: T) => {
        setFieldValue(fieldId, value);
      }, []),
      onFocus: React.useCallback(() => {
        setFieldTouched(fieldId, false);
      }, []),
      setFieldValue,
    },
    {
      error: useSelector(
        formContext, ({ errors }: FormHookContext) => get(errors, fieldId)),
      touched: useSelector(
        formContext, ({ touched }: FormHookContext) => get(touched, fieldId)),
      value: useSelector(
        formContext, ({ values }: FormHookContext) => get(values, fieldId) || ''),
    },
  ];
}

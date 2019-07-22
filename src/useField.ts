import * as React from 'react';
import { useContextSelector } from 'use-context-selector';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import { FormHookContext } from './types';

export interface FieldOperations<T> {
  onBlur: () => void;
  onChange: (value: T) => void;
  onFocus: () => void;
  // TODO: this can maybe removed, I saw this as an escape hatch,
  // to deal with cross-dependent fields.
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
      error: useContextSelector(
        formContext, ({ errors }: FormHookContext) => get(errors, fieldId)),
      touched: useContextSelector(
        formContext, ({ touched }: FormHookContext) => get(touched, fieldId)),
      value: useContextSelector(
        formContext, ({ values }: FormHookContext) => get(values, fieldId) || ''),
    },
  ];
}

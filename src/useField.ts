import * as React from 'react';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import baseReset from './helpers/reset';

export interface FieldOperations {
  onBlur: () => void;
  onChange: (value: any) => void;
  onFocus: () => void;
  setFieldValue: (fieldId: string, value: any) => void;
  reset: () => void;
}

export interface FieldInformation {
  error: string;
  touched: boolean;
  value: any;
}

export default function useField(fieldId: string): [FieldOperations, FieldInformation] {
  // Dev-check
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Field needs a valid "fieldId" property to  function correctly.');
  }
  // Context
  const {
    errors,
    initialValues,
    values,
    setFieldValue,
    setFieldTouched,
    touched,
  } = React.useContext(formContext);
  // Values
  const initialValue = React.useMemo(() => get(initialValues, fieldId), [initialValues]);
  const value = React.useMemo(() => get(values, fieldId), [values]);
  return [
    {
      onBlur: React.useCallback(() => setFieldTouched(fieldId, true), []),
      onChange: React.useCallback((val: any) => setFieldValue(fieldId, val), []),
      onFocus: React.useCallback(() => setFieldTouched(fieldId, false), []),
      reset: React.useCallback(() => {
        setFieldValue(fieldId, initialValue || baseReset(value));
        setFieldTouched(fieldId, false);
      }, []),
      setFieldValue,
    },
    {
      error: React.useMemo(() => get(errors, fieldId), [errors]),
      touched: React.useMemo(() => get(touched, fieldId), [touched]),
      value,
    },
  ];
}

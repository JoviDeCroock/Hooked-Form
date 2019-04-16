import * as React from 'react';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';

export interface FieldOperations {
  onBlur: () => void;
  onChange: (value: any) => void;
  onFocus: () => void;
  setFieldValue: (fieldId: string, value: any) => void;
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
  return [
    {
      onBlur: React.useCallback(() => setFieldTouched(fieldId, true), []),
      onChange: React.useCallback((val: any) => setFieldValue(fieldId, val), []),
      onFocus: React.useCallback(() => setFieldTouched(fieldId, false), []),
      setFieldValue,
    },
    {
      error: React.useMemo(() => get(errors, fieldId), [errors]),
      touched: React.useMemo(() => get(touched, fieldId), [touched]),
      value: React.useMemo(() => get(values, fieldId), [values]),
    },
  ];
}

import * as React from 'react';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';

export interface FieldOperations<T> {
  onBlur: () => void;
  onChange: (value: T) => void;
  onFocus: () => void;
  setFieldValue: (fieldId: string, value: T) => void;
}

export interface FieldInformation<T> {
  error: string;
  touched: boolean;
  value: T;
}

export default function useField<T = any>(
  fieldId: string
): [FieldOperations<T>, FieldInformation<T>] {
  // Dev-check
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Field needs a valid "fieldId" property to  function correctly.');
  }
  // Context
  const { errors, values, setFieldValue, setFieldTouched, touched } = React.useContext(formContext);

  if (process.env.NODE_ENV !== 'production') {
    React.useDebugValue(`${fieldId} Value: ${get(values, fieldId)}`);
    React.useDebugValue(`${fieldId} Touched: ${get(touched, fieldId)}`);
    React.useDebugValue(`${fieldId} Error: ${get(errors, fieldId)}`);
  }

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
      error: React.useMemo(() => get(errors, fieldId), [errors]),
      touched: React.useMemo(() => get(touched, fieldId), [touched]),
      value: React.useMemo(() => get(values, fieldId) || '', [values]),
    },
  ];
}

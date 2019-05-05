import { useContext, useMemo, useDebugValue, useCallback } from 'preact/hooks';
import { formContext } from './context';
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
    values,
    setFieldValue,
    setFieldTouched,
    touched,
  } = useContext(formContext);

  if (process.env.NODE_ENV !== 'procution') {
    useDebugValue(`${fieldId} Value: ${get(values, fieldId)}`);
    useDebugValue(`${fieldId} Touched: ${get(touched, fieldId)}`);
    useDebugValue(`${fieldId} Error: ${get(errors, fieldId)}`);
  }

  return [
    {
      onBlur: useCallback(() => setFieldTouched(fieldId, true), []),
      onChange: useCallback((value: any) => setFieldValue(fieldId, value), []),
      onFocus: useCallback(() => setFieldTouched(fieldId, false), []),
      setFieldValue,
    },
    {
      error: useMemo(() => get(errors, fieldId), [errors]),
      touched: useMemo(() => get(touched, fieldId), [touched]),
      value: useMemo(() => get(values, fieldId) || '', [values]),
    },
  ];
}

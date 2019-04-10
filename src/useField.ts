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
  const error = React.useMemo(() => get(errors, fieldId), [errors]);
  const initialValue = React.useMemo(() => get(initialValues, fieldId), [initialValues]);
  const value = React.useMemo(() => get(values, fieldId), [values]);
  const isFieldTouched = React.useMemo(() => get(touched, fieldId), [touched]);
  // Methods
  const reset = React.useCallback(() => {
    setFieldValue(fieldId, initialValue || baseReset(value));
    setFieldTouched(fieldId, false);
  }, []);
  const onChange = React.useCallback((val: any) => setFieldValue(fieldId, val), []);
  const onBlur = React.useCallback(() => setFieldTouched(fieldId, true), []);
  const onFocus = React.useCallback(() => setFieldTouched(fieldId, false), []);
  return [
    { onChange, onBlur, onFocus, reset, setFieldValue },
    { error, touched: isFieldTouched, value },
  ];
}

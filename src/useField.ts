import * as React from 'react';
import { get } from './helpers/operations';
import { EMPTY_ARRAY } from './helpers/useState';
import { useContextEmitter } from './useContextEmitter';

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

  const ctx = useContextEmitter(fieldId);

  return [
    {
      onBlur: React.useCallback(() => {
        ctx.setFieldTouched(fieldId, true);
      }, EMPTY_ARRAY),
      onChange: React.useCallback((value: T) => {
        ctx.setFieldValue(fieldId, value);
      }, EMPTY_ARRAY),
      onFocus: React.useCallback(() => {
        ctx.setFieldTouched(fieldId, false);
      }, EMPTY_ARRAY),
      setFieldValue: ctx.setFieldValue,
    },
    {
      error: get(ctx.errors, fieldId),
      touched: get(ctx.touched, fieldId),
      value: get(ctx.values, fieldId) || '',
    },
  ];
}

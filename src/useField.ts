import { useEffect } from 'react';
import { get } from './helpers/operations';
import { FieldInformation } from './types';
import { useContextEmitter } from './useContextEmitter';

export interface FieldOperations<T> {
  onBlur: () => void;
  onChange: (value: T) => void;
  onFocus: () => void;
}

export default function useField<T = any>(
  fieldId: string,
  validate?: (value: T) => string | undefined
): [FieldOperations<T>, FieldInformation<T>] {
  if (
    process.env.NODE_ENV !== 'production' &&
    (!fieldId || typeof fieldId !== 'string')
  ) {
    throw new Error(
      'The Field needs a valid "fieldId" property to function correctly.'
    );
  }

  const ctx = useContextEmitter(fieldId);

  useEffect(() => {
    let index: number;
    if (validate) index = ctx.fieldValidators.push([fieldId, validate]);
    return () => {
      if (index) {
        ctx.fieldValidators.splice(index - 1, 1);
      }
    };
  }, []);

  return [
    {
      onBlur: () => {
        ctx.setFieldTouched(fieldId, true);
      },
      onChange: (value: T) => {
        ctx.setFieldValue(fieldId, value);
      },
      onFocus: () => {
        ctx.setFieldTouched(fieldId, false);
      },
    },
    {
      error: get(ctx.errors, fieldId),
      touched: get(ctx.touched, fieldId),
      value: get(ctx.values, fieldId) || '',
    },
  ];
}

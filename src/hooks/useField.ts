import { useEffect, useContext } from 'react';
import { get } from '../helpers/operations';
import {
  FieldInformation,
  ValidationTuple,
  PrivateFormHookContext,
} from '../types';
import { formContext } from '../Form';

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

  const ctx = useContext(formContext) as PrivateFormHookContext;

  useEffect(() => {
    const tuple: ValidationTuple = [fieldId, validate as (v: T) => string];

    if (validate) ctx._fieldValidators.push(tuple);

    return () => {
      if (validate) {
        ctx._fieldValidators.splice(ctx._fieldValidators.indexOf(tuple), 1);
      }
    };
  }, [fieldId]);

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

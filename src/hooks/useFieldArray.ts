import { useContext } from 'react';
import { get } from '../helpers/operations';
import { formContext } from '../Form';

export interface FieldOperations<T> {
  add: (item: T) => void;
  insert: (at: number, element: T) => void;
  remove: (toDelete: number) => void;
}

export interface FieldInformation<T> {
  error: string | null;
  value: Array<T>;
}

export default function useFieldArray<T = any>(
  fieldId: string
): [FieldOperations<T>, FieldInformation<T>] {
  if (
    process.env.NODE_ENV !== 'production' &&
    (!fieldId || typeof fieldId !== 'string')
  ) {
    throw new Error(
      'The FieldArray needs a valid "fieldId" property to function correctly.'
    );
  }

  const ctx = useContext(formContext);
  const value: Array<T> = get(ctx.values, fieldId) || [];

  return [
    {
      add: (element: T) => {
        ctx.setFieldValue(fieldId, [...value, element]);
      },
      insert: (at: number, element: T) => {
        const touched = get(ctx.touched, fieldId) || [];
        const errors = get(ctx.errors, fieldId);

        value.splice(at, 0, element);
        touched.splice(at, 0, false);

        ctx.setFieldValue(fieldId, value);
        ctx.setFieldTouched(fieldId, touched as any);
        if (errors) {
          errors.splice(at, 0, undefined);
          ctx.setFieldError(fieldId, errors as any);
        }
      },
      remove: (index: number) => {
        const touched = get(ctx.touched, fieldId) || [];
        const errors = get(ctx.errors, fieldId);

        value.splice(index, 1);
        touched.splice(index, 1);

        ctx.setFieldValue(fieldId, value);
        ctx.setFieldTouched(fieldId, touched as any);
        if (errors) {
          errors.splice(index, 1);
          ctx.setFieldError(fieldId, errors as any);
        }
      },
    },
    {
      error: get(ctx.errors, fieldId),
      value,
    },
  ];
}

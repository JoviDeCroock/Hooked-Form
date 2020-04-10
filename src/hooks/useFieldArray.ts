import { get } from '../helpers/operations';
import { useContextEmitter } from './useContextEmitter';
import { ArrayHookContext } from '../types';

export interface FieldOperations<T> {
  add: (item: T) => void;
  insert: (at: number, element: T) => void;
  move: (from: number, to: number) => void;
  remove: (toDelete: number) => void;
  replace: (at: number, element: T) => void;
  swap: (first: number, second: number) => void;
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

  const ctx = useContextEmitter(fieldId) as ArrayHookContext;
  const values: Array<T> = get(ctx.values, fieldId);

  return [
    {
      add: (element: T) => {
        const value = get(ctx._getValues().current, fieldId) || [];
        ctx.setFieldValue(fieldId, [...value, element]);
      },
      insert: (at: number, element: T) => {
        const value = get(ctx._getValues().current, fieldId) || [];
        const touched = get(ctx._getTouched().current, fieldId) || [];
        const errors = get(ctx._getErrors().current, fieldId) || [];

        value.splice(at, 0, element);
        touched.splice(at, 0, false);
        errors.splice(at, 0, undefined);

        ctx.setFieldValue(fieldId, value);
        ctx.setFieldTouched(fieldId, touched as any);
        ctx.setFieldError(fieldId, errors as any);
      },
      move: (from: number, to: number) => {
        const value = get(ctx._getValues().current, fieldId) || [];
        const touched = get(ctx._getTouched().current, fieldId) || [];
        const errors = get(ctx._getErrors().current, fieldId) || [];

        const result = [...value];
        const newTouched = [...touched];
        const newErrors = [...errors];

        result.splice(from, 1);
        result.splice(to, 0, value[from]);
        newTouched.splice(from, 1);
        newTouched.splice(to, 0, touched[from]);
        newErrors.splice(from, 1);
        newErrors.splice(to, 0, errors[from]);

        ctx.setFieldValue(fieldId, result);
        ctx.setFieldTouched(fieldId, newTouched as any);
        ctx.setFieldError(fieldId, newErrors as any);
      },
      remove: (index: number) => {
        const value = get(ctx._getValues().current, fieldId) || [];
        const touched = get(ctx._getTouched().current, fieldId) || [];
        const errors = get(ctx._getErrors().current, fieldId) || [];

        value.splice(index, 1);
        errors.splice(index, 1);
        touched.splice(index, 1);

        ctx.setFieldValue(fieldId, value);
        ctx.setFieldTouched(fieldId, touched as any);
        ctx.setFieldError(fieldId, errors as any);
      },
      replace: (at: number, element: T) => {
        const value = get(ctx._getValues().current, fieldId) || [];
        const touched = get(ctx._getTouched().current, fieldId) || [];
        const errors = get(ctx._getErrors().current, fieldId) || [];

        value[at] = element;
        touched[at] = false;
        delete errors[at];

        ctx.setFieldValue(fieldId, value);
        ctx.setFieldTouched(fieldId, touched as any);
        ctx.setFieldError(fieldId, errors as any);
      },
      swap: (from: number, to: number) => {
        const value = get(ctx._getValues().current, fieldId) || [];
        const touched = get(ctx._getTouched().current, fieldId) || [];
        const errors = get(ctx._getErrors().current, fieldId) || [];

        const result = [...value];
        const newTouched = [...touched];
        const newErrors = [...errors];

        result[from] = value[to];
        result[to] = value[from];
        newTouched[from] = touched[to];
        newTouched[to] = touched[from];
        newErrors[from] = errors[to];
        newErrors[to] = errors[from];

        ctx.setFieldValue(fieldId, result);
        ctx.setFieldTouched(fieldId, newTouched as any);
        ctx.setFieldError(fieldId, newErrors as any);
      },
    },
    {
      error: get(ctx.errors, fieldId),
      value: values,
    },
  ];
}

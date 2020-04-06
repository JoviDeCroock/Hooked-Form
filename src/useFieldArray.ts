import { get } from './helpers/operations';
import { useContextEmitter } from './useContextEmitter';

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

  const ctx = useContextEmitter(fieldId);
  const value: Array<T> = get(ctx.values, fieldId);
  const errors: Array<any> = get(ctx.errors, fieldId) || [];
  const touched: Array<any> = get(ctx.touched, fieldId) || [];

  return [
    {
      add: (element: T) => {
        ctx.setFieldValue(fieldId, [...value, element]);
      },
      insert: (at: number, element: T) => {
        value.splice(at, 0, element);
        touched.splice(at, 0, {});
        errors.splice(at, 0, {});

        ctx.setFieldValue(fieldId, value);
        ctx.setFieldTouched(fieldId, touched as any);
        ctx.setFieldError(fieldId, errors as any);
      },
      move: (from: number, to: number) => {
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
        value.splice(index, 1);
        ctx.setFieldValue(fieldId, value);
      },
      replace: (at: number, element: T) => {
        value[at] = element;
        touched[at] = false;
        delete errors[at];

        ctx.setFieldValue(fieldId, value);
        ctx.setFieldTouched(fieldId, touched as any);
        ctx.setFieldError(fieldId, errors as any);
      },
      swap: (from: number, to: number) => {
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
      value,
    },
  ];
}

import * as React from 'react';
import { on } from './context/emitter';
import { get } from './helpers/operations';
import useFormConnect from './useFormConnect';

export interface FieldOperations<T> {
  add: (item: T) => void;
  insert: (at: number, element: T) => void;
  move: (from: number, to: number) => void;
  remove: (toDelete: T | number) => void;
  replace: (at: number, element: T) => void;
  swap: (first: number, second: number) => void;
}

export interface FieldInformation<T> {
  error: string | null;
  value: Array<T>;
}

export default function useFieldArray<T = any>(
  fieldId: string,
): [FieldOperations<T>, FieldInformation<T>] {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The FieldArray needs a valid "fieldId" property to function correctly.');
  }

  on(
    fieldId,
    // @ts-ignore
    React.useReducer(c => !c, false)[1],
    ['touched', 'error'],
  );

  const { setFieldValue, values, errors } = useFormConnect();
  const value: Array<any> = get(values, fieldId);

  return [
    {
      add: React.useCallback(
        (element: T) => {
          setFieldValue(fieldId, [...value, element]);
        },
        [value],
      ),
      insert: React.useCallback(
        (at: number, element: T) => {
          const result = [...value];
          result.splice(at, 0, element);
          setFieldValue(fieldId, result);
        },
        [value],
      ),
      move: React.useCallback(
        (from: number, to: number) => {
          const result = [...value];
          result.splice(from, 1);
          result.splice(to, 0, value[from]);
          setFieldValue(fieldId, result);
        },
        [value],
      ),
      remove: React.useCallback(
        (element: T | number) => {
          setFieldValue(
            fieldId,
            value.filter(x => x !== (typeof element === 'number' ? value[element] : element)),
          );
        },
        [value],
      ),
      replace: React.useCallback(
        (at: number, element: T) => {
          const result = [...value];
          result[at] = element;
          setFieldValue(fieldId, result);
        },
        [value],
      ),
      swap: React.useCallback(
        (from: number, to: number) => {
          const result = [...value];
          result[from] = value[to];
          result[to] = value[from];
          setFieldValue(fieldId, result);
        },
        [value],
      ),
    },
    {
      error: get(errors, fieldId),
      value,
    },
  ];
}

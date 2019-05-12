import * as React from 'react';
import {
  add as aAdd,
  insert as aInsert,
  move as aMove,
  remove as aRemove,
  replace as aReplace,
  swap as aSwap,
} from './helpers/arrays';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';

export interface FieldOperations<T> {
  add: (item: T) => void;
  insert: (at: number, element: T) => void;
  move: (from: number, to: number) => void;
  setFieldValue: (fieldId: string, value: T) => void;
  remove: (toDelete: T | number) => void;
  replace: (at: number, element: T) => void;
  swap: (first: number, second: number) => void;
}

export interface FieldInformation<T> {
  error: string | null;
  value: Array<T>;
}

export default function useFieldArray<T = any>(fieldId: string):
  [FieldOperations<T>, FieldInformation<T>] {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The FieldArray needs a valid "fieldId" property to  function correctly.');
  }

  const { errors, values, setFieldValue } = React.useContext(formContext);
  const value: Array<any> = React.useMemo(() => get(values, fieldId) || [], [values]);

  if (process.env.NODE_ENV !== 'production') {
    React.useDebugValue(`${fieldId} Value: ${value}`);
    React.useDebugValue(`${fieldId} Error: ${get(errors, fieldId)}`);
  }

  return [
    {
      add: React.useCallback((element: T) => {
        setFieldValue(fieldId, aAdd(value, element));
      }, [value]),
      insert: React.useCallback((at: number, element: T) => {
        setFieldValue(fieldId, aInsert(value, at, element));
      }, [value]),
      move: React.useCallback((from: number, to: number) => {
        setFieldValue(fieldId, aMove(value, from, to));
      }, [value]),
      remove: React.useCallback((element: T | number) => {
        setFieldValue(fieldId, aRemove(value, element));
      }, [value]),
      replace: React.useCallback((at: number, element: T) => {
        setFieldValue(fieldId, aReplace(value, at, element));
      }, [value]),
      setFieldValue,
      swap: React.useCallback((from: number, to: number) => {
        setFieldValue(fieldId, aSwap(value, from, to));
      }, [value]),
    },
    {
      error: React.useMemo(() => get(errors, fieldId), [errors]),
      value,
    },
  ];
}

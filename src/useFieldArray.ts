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
import baseReset from './helpers/reset';

export interface FieldOperations {
  add: (item: any) => void;
  insert: (at: number, element: object) => void;
  move: (from: number, to: number) => void;
  setFieldValue: (fieldId: string, value: any) => void;
  remove: (toDelete: object | number) => void;
  replace: (at: number, element: object) => void;
  reset: () => void;
  swap: (first: number, second: number) => void;
}

export interface FieldInformation {
  error: string | null;
  value: any;
}

export default function useFieldArray(fieldId: string): [FieldOperations, FieldInformation] {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The FieldArray needs a valid "fieldId" property to  function correctly.');
  }

  const { errors, initialValues, values, setFieldValue } = React.useContext(formContext);
  const initialValue = React.useMemo(() => get(initialValues, fieldId), [initialValues]);
  const value: Array<any> = React.useMemo(() => get(values, fieldId) || [], [values]);

  value.map = React.useCallback((callback) => { // TODO: change this to only happen on proto.map
    const array: Array<any> = [];
    value.forEach((element: any, i: number) => {
      const el = callback(element, `${fieldId}[${i}]`, i);
      array.push(el);
    });
    return array;
  }, [value]);

  return [
    {
      add: React.useCallback((element: any) =>
        setFieldValue(fieldId, aAdd(value, element)), [value]),
      insert: React.useCallback((at: number, element: object) =>
        setFieldValue(fieldId, aInsert(value, at, element)), [value]),
      move: React.useCallback((from: number, to: number) =>
        setFieldValue(fieldId, aMove(value, from, to)), [value]),
      remove: React.useCallback((toDelete: object | number) =>
        setFieldValue(fieldId, aRemove(value, toDelete)), [value]),
      replace: React.useCallback((at: number, element: object) =>
        setFieldValue(fieldId, aReplace(value, at, element)), [value]),
      reset: React.useCallback(() =>
        setFieldValue(fieldId, initialValue || baseReset(value)), [initialValue]),
      setFieldValue,
      swap: React.useCallback((first: number, second: number) =>
        setFieldValue(fieldId, aSwap(value, first, second)), [value]),
    },
    {
      error: React.useMemo(() => get(errors, fieldId), [errors]),
      value,
    },
  ];
}

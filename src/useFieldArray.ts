import * as React from 'react';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';

export interface FieldOperations {
  add: (item: any) => void;
  insert: (at: number, element: object) => void;
  move: (from: number, to: number) => void;
  remove: (toDelete: object | number) => void;
  replace: (at: number, element: object) => void;
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

  const { errors, values, setFieldValue } = React.useContext(formContext);
  const value: Array<any> = React.useMemo(() => get(values, fieldId) || [], [values]);

  if (process.env.NODE_ENV !== 'production') {
    React.useDebugValue(`${fieldId} Value: ${value}`);
    React.useDebugValue(`${fieldId} Error: ${get(errors, fieldId)}`);
  }

  return [
    {
      add: React.useCallback((element: any) => {
        setFieldValue(fieldId, [...value, element]);
      }, [value]),
      insert: React.useCallback((at: number, element: object) => {
        const result = [...value];
        result.splice(at, 0, element);
        setFieldValue(fieldId, result);
      }, [value]),
      move: React.useCallback((from: number, to: number) => {
        const result = [...value];
        result.splice(from, 1);
        result.splice(to, 0, value[from]);
        setFieldValue(fieldId, result);
      }, [value]),
      remove: React.useCallback((element: object | number) => {
        setFieldValue(
          fieldId,
          value.filter(x => x !== (typeof element === 'number' ? value[element] : element)),
        );
      }, [value]),
      replace: React.useCallback((at: number, element: object) => {
        const result = [...value];
        result[at] = element;
        setFieldValue(fieldId, result);
      }, [value]),
      swap: React.useCallback((from: number, to: number) => {
        const result = [...value];
        result[from] = value[to];
        result[to] = value[from];
        setFieldValue(fieldId, result);
      }, [value]),
    },
    {
      error: React.useMemo(() => get(errors, fieldId), [errors]),
      value,
    },
  ];
}

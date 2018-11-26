import * as React from 'react';
import { add, insert, move, remove, replace, swap } from './helpers/arrays';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import reset from './helpers/reset';

interface FieldProps {
  component: any;
  fieldId: string;
  render: (props: object) => any;
  [x: string]: any;
}

const FieldArrayContainer = ({ component, render, fieldId, ...rest }: FieldProps) => {
  if (!component && ! render) {
    throw new Error('The FieldArray needs a "component" or a "render" property to  function correctly.');
  }

  if (!fieldId || typeof fieldId !== 'string') {
    throw new Error('The FieldArray needs a valid "fieldId" property to  function correctly.');
  }

  const {
    errors,
    initialValues,
    values,
    setFieldValue,
  } = React.useContext(formContext);

  const error = React.useMemo(() => get(errors, fieldId), [errors, fieldId]);
  const initialValue = React.useMemo(() => get(initialValues, fieldId), [initialValues, fieldId]);
  const value: Array<any> = React.useMemo(() => get(values, fieldId) || [], [values, fieldId]);

  value.map = React.useCallback(callback => {
    const array: Array<any> = [];
    value.forEach((element: any, i: number) => {
      const el = callback(element, `${fieldId}[${i}]`, i);
      array.push(el);
    });
    return array;
  }, [value]);

  const resetFieldValue = React.useCallback(() => { setFieldValue(fieldId, initialValue || reset(value)); }, [value]);
  const addElement = React.useCallback((element: any = {}) => { setFieldValue(fieldId, add(value, element)); }, [value]);
  const swapElement = React.useCallback((first: number, second: number) => { setFieldValue(fieldId, swap(value, first, second)) }, [value]);
  const insertElement = React.useCallback((at: number, element: object) => { setFieldValue(fieldId, insert(value, at, element)) }, [value]);
  const moveElement = React.useCallback((from: number, to: number) => { setFieldValue(fieldId, move(value, from, to)) }, [value]);
  const removeElement = React.useCallback((toDelete: object | number) => { setFieldValue(fieldId, remove(value, toDelete)) }, [value]);
  const replaceElement = React.useCallback((at: number, element: object) => { setFieldValue(fieldId, replace(value, at, element)) }, [value]);

  const props = {
    addElement,
    error,
    fieldId,
    insertElement,
    moveElement,
    removeElement,
    replaceElement,
    reset: resetFieldValue,
    swapElement,
    values: value,
    ...rest,
  }

  return component ? React.createElement(component, props) : render(props);
};

export default FieldArrayContainer;

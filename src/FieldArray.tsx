import * as React from 'react';
import { formContext } from './helpers/context';
import { get, set } from './helpers/operations';
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

  const error = get(errors, fieldId);
  const initialValue = get(initialValues, fieldId);
  const value: Array<any> = get(values, fieldId) || [];

  value.map = React.useCallback(callback => {
    const array: Array<any> = [];
    value.forEach((element: any, i: number) => {
      const el = callback(element, `${fieldId}[${i}]`, i);
      array.push(el);
    });
    return array;
  }, [value]);

  const resetFieldValue = React.useCallback(() => {
    setFieldValue(fieldId, initialValue || reset(value));
  }, [value]);

  const addElement = React.useCallback((element: any = {}) => {
    setFieldValue(fieldId, [...value, element]);
  }, [value]);

  const removeElement = (toDelete: object | number) => {
    if (typeof toDelete === 'number') {
      setFieldValue(fieldId, value.splice(toDelete, 1));
    } else {
      setFieldValue(fieldId, value.filter(x => x !== toDelete));
    }
  };

  const moveElement = (from: number, to: number) => {
    // TODO
  }

  const props = {
    addElement,
    error,
    fieldId,
    removeElement,
    reset: resetFieldValue,
    values: value,
    ...rest,
  }

  return component ? React.createElement(component, props) : render(props);
};

export default FieldArrayContainer;

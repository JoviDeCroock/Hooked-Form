import * as React from 'react';
import { formContext } from './helpers/context';
import { get, set } from './helpers/operations';
import reset from './helpers/reset';

interface FieldProps {
  Component: any;
  fieldId: string;
}

const FieldArrayContainer = React.memo(({ Component, fieldId, ...rest }: FieldProps) => {
  const {
    errors,
    initialValues,
    values,
    setFieldValue,
  } = React.useContext(formContext);

  const error = get(errors, fieldId);
  const initialValue = get(initialValues, fieldId);
  const value: Array<any> = get(values, fieldId) || [];

  const resetFieldValue = React.useCallback(() => {
    setFieldValue(fieldId, initialValue || reset(value));
  }, [value]);

  const addElement = React.useCallback((element: any = {}) => {
    setFieldValue(fieldId, [...value, element]);
  }, [value]);

  return (
    <Component
      addElement={addElement}
      error={error}
      fieldId={fieldId}
      reset={resetFieldValue}
      values={value}
      {...rest}
    />
  )
});

export default FieldArrayContainer;

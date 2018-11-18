import * as React from 'react';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import reset from './helpers/reset';

interface FieldProps {
  component: any;
  fieldId: string;
}

const FieldContainer = React.memo(({ component, fieldId, ...rest }: FieldProps) => {
  if (!component) {
    throw new Error('The Field needs a "component" property to  function correctly.');
  }

  if (!fieldId || typeof fieldId !== 'string') {
    throw new Error('The Field needs a valid "fieldId" property to  function correctly.');
  }

  const {
    errors,
    initialValues,
    values,
    setFieldValue,
    setFieldTouched,
  } = React.useContext(formContext);

  const error = get(errors, fieldId);
  const initialValue = get(initialValues, fieldId);
  const value = get(values, fieldId);

  const resetFieldValue = React.useCallback(() => {
    setFieldValue(fieldId, initialValue || reset(value));
    setFieldTouched(fieldId, false);
  }, [value]);

  const props = {
    error,
    onBlur: setFieldTouched.bind(null, fieldId),
    onChange: setFieldValue.bind(null, fieldId),
    reset: resetFieldValue,
    setFieldTouched,
    setFieldValue,
    value: value || '',
    ...rest,
  }

  return React.createElement(component, props);
});

export default FieldContainer;

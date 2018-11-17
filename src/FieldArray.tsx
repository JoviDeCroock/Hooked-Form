import * as React from 'react';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import reset from './helpers/reset';

interface FieldProps {
  Component: any;
  fieldId: string;
}

const FieldContainer = React.memo(({ Component, fieldId, ...rest }: FieldProps) => {
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
  }, [value]);

  return (
    <Component
      error={error}
      onBlur={setFieldTouched.bind(null, fieldId)}
      onChange={setFieldValue.bind(null, fieldId)}
      reset={resetFieldValue}
      value={value || ''}
      {...rest}
    />
  )
});

export default FieldContainer;

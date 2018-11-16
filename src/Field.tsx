import * as React from 'react';
import { formContext } from './helpers/context';
import reset from './helpers/reset';

interface FieldProps {
  Component: any;
  fieldId: string;
}

const FieldContainer = React.memo(({ Component, fieldId, ...rest }: FieldProps) => {
  const {
    errors: { [fieldId]: error },
    initialValues: { [fieldId]: initialValue },
    values: { [fieldId]: value },
    setFieldValue,
    setFieldTouched,
  } = React.useContext(formContext);

  const resetFieldValue = () => setFieldValue(fieldId, initialValue || reset(value));

  return (
    <Component
      error={error}
      onBlur={setFieldTouched.bind(null, fieldId)}
      onChange={setFieldValue.bind(null, fieldId)}
      reset={setFieldValue}
      value={value}
      {...rest}
    />
  )
});

export default FieldContainer;

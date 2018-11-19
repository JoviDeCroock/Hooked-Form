import * as React from 'react';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import reset from './helpers/reset';

interface FieldProps {
  component: any;
  fieldId: string;
  [x: string]: any;
}

const FieldContainer = ({ component, fieldId, ...rest }: FieldProps) => {
  if (!component) {
    throw new Error('The Field needs a "component" property to  function correctly.');
  }

  if (!fieldId || typeof fieldId !== 'string') {
    throw new Error('The Field needs a valid "fieldId" property to  function correctly.');
  }

  const { errors, } = React.useContext(formContext);
  const error = get(errors, fieldId);
  const props = { error, ...rest };

  return React.createElement(component, props);
};

export default FieldContainer;

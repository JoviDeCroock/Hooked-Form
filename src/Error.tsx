import * as React from 'react';
import useError from './useError';

export interface FieldProps {
  component: any;
  fieldId: string;
  [additionalProps: string]: any;
}

// TODO: convert from component to children()
const ErrorContainer: React.FC<FieldProps> = ({ component, fieldId }) => {
  if (process.env.NODE_ENV !== 'production' && !component) {
    throw new Error('The ErrorMessage needs a "component" property to  function correctly.');
  }
  return React.createElement(component, { error: useError(fieldId) });
};

export default ErrorContainer;

import * as React from 'react';
import useError from './useError';

export interface FieldProps {
  component: any;
  fieldId: string;
  [additionalProps: string]: any;
}

const ErrorContainer: React.FC<FieldProps> = ({ component, fieldId }) => {
  if (process.env.NODE_ENV !== 'production' && !component) {
    throw new Error('The ErrorMessage needs a "component" property to  function correctly.');
  }
  const error = useError(fieldId);
  return React.createElement(component, { error });
};

export default React.memo(ErrorContainer, () => true);

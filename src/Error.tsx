import * as React from 'react';
import useError from './useError';

export interface FieldProps {
  component: any;
  fieldId: string;
  [additionalProps: string]: any;
}

const ErrorContainer: React.FC<FieldProps> = ({ component, fieldId, ...rest }) => {
  if (process.env.NODE_ENV !== 'production' && !component) {
    throw new Error('The ErrorMessage needs a "component" property to  function correctly.');
  }
  const error = useError(fieldId);
  return React.useMemo(() => React.createElement(component, { error, ...rest }), [error]);
};

export default React.memo(ErrorContainer, () => true);

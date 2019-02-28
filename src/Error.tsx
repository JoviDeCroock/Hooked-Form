import * as React from 'react';
import useError from './useError';

export interface FieldProps {
  component: any;
  fieldId: string;
  [additionalProps: string]: any;
}

const ErrorContainer: React.FC<FieldProps> = React.memo(({ component, fieldId, ...rest }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!component) {
      throw new Error('The Field needs a "component" property to  function correctly.');
    }
  }
  const error = useError(fieldId);
  return React.useMemo(() => React.createElement(component, { error, ...rest }), [error]);
}, () => true);

export default ErrorContainer;

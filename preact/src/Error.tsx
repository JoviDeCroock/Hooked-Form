import { createElement, FunctionalComponent } from 'preact';
import useError from './useError';

export interface FieldProps {
  component: any;
  fieldId: string;
  [additionalProps: string]: any;
}

const ErrorContainer: FunctionalComponent<FieldProps> = ({ component, fieldId, ...rest }) => {
  if (process.env.NODE_ENV !== 'production' && !component) {
    throw new Error('The ErrorMessage needs a "component" property to  function correctly.');
  }
  const error = useError(fieldId);
  return createElement(component, { error, ...rest });
};

export default ErrorContainer;

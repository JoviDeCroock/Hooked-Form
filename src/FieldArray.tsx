import * as React from 'react';
import useFieldArray from './useFieldArray';

export interface FieldProps {
  component?: any;
  fieldId: string;
  render?: (props: object) => any;
  [x: string]: any;
}

// TODO: convert render to children
const FieldArrayContainer: React.FC<FieldProps> = (
  { component, render, fieldId },
) => {
  if (process.env.NODE_ENV !== 'production' && !component && !render) {
    throw new Error(
      'The FieldArray needs a "component" or a "render" property to function correctly.',
    );
  }
  const {
    0: actions,
    1: res,
  } = useFieldArray(fieldId);

  const props = {
    fieldId,
    ...res,
    ...actions,
  };

  return component ? React.createElement(component, props) : render!(props);
};

export default React.memo(FieldArrayContainer, () => true);

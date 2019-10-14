import * as React from 'react';
import useFieldArray from '../../src/useFieldArray';

export interface FieldProps {
  component?: any;
  fieldId: string;
  children?: (props: object) => any;
  [x: string]: any;
}

const FieldArrayContainer: React.FC<FieldProps> = (
  { component, children, fieldId },
) => {
  if (process.env.NODE_ENV !== 'production' && !component && !children) {
    throw new Error(
      'The FieldArray needs a "component" or a "children" property to function correctly.',
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

  return component ? React.createElement(component, props) : children!(props);
};

export default React.memo(FieldArrayContainer, () => true);

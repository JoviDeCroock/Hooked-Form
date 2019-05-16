import * as React from 'react';
import useFieldArray from './useFieldArray';

export interface FieldProps {
  component?: any;
  fieldId: string;
  render?: (props: object) => any;
  [x: string]: any;
}

const FieldArrayContainer: React.FC<FieldProps> = (
  { component, render, fieldId, ...rest },
) => {
  if (process.env.NODE_ENV !== 'production' && !component && !render) {
    throw new Error(
      'The FieldArray needs a "component" or a "render" property to function correctly.',
    );
  }
  const {
    0: {
      add, insert, move, remove,
      replace, swap,
    },
    1: { value, error },
  } = useFieldArray(fieldId);

  const props = {
    add,
    error,
    fieldId,
    insert,
    move,
    remove,
    replace,
    swap,
    value,
    ...rest,
  };

  return React.useMemo(() =>
    component ? React.createElement(component, props) : render!(props), [value, error]);
};

export default React.memo(FieldArrayContainer, () => true);

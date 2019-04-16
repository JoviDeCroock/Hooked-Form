import * as React from 'react';
import useFieldArray from './useFieldArray';

export interface FieldProps {
  component?: any;
  fieldId: string;
  render?: (props: object) => any;
  [x: string]: any;
}

const FieldArrayContainer: React.FC<FieldProps> = React.memo((
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

  return component ?
    React.useMemo(() => React.createElement(component, props), [value, error])
    : React.useMemo(() => render!(props), [value, error]);
}, () => true);

export default FieldArrayContainer;

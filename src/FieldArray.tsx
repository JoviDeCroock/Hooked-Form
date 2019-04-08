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
      addElement, insertElement, moveElement, removeElement,
      replaceElement, resetField, swapElement,
    },
    1: { value, error },
  } = useFieldArray(fieldId);
  const props = {
    addElement, // TODO: rename to add
    error,
    fieldId,
    insertElement, // TODO: rename to insert
    moveElement, // TODO: rename to move
    removeElement, // TODO: rename to remove
    replaceElement, // TODO: rename to replace
    reset: resetField,
    swapElement, // TODO: rename to swap
    values: value, // TODO: rename to value
    ...rest,
  };

  return component ?
    React.useMemo(() => React.createElement(component, props), [value, error])
    : render && React.useMemo(() => render(props), [value, error]);
}, () => true);

export default FieldArrayContainer;

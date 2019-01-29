import * as React from 'react'
import useFieldArray from './useFieldArray'

export interface FieldProps {
  component?: any
  fieldId: string
  render?: (props: object) => any
  [x: string]: any
}

const FieldArrayContainer: React.FC<FieldProps> = React.memo(({ component, render, fieldId, ...rest }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!component && !render) { throw new Error('The FieldArray needs a "component" or a "render" property to  function correctly.') }
  }
  const {
    0: {
      addElement, insertElement, moveElement, removeElement,
      replaceElement, resetField, swapElement,
    },
    1: { value, error },
  } = useFieldArray(fieldId)
  const props = {
    addElement,
    error,
    fieldId,
    insertElement,
    moveElement,
    removeElement,
    replaceElement,
    reset: resetField,
    swapElement,
    values: value,
    ...rest
  }

  return component ?
    React.useMemo(() => React.createElement(component, props), [value, error])
    : render && React.useMemo(() => render(props), [value, error])
}, () => true)

export default FieldArrayContainer

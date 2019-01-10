import * as React from 'react'
import useFieldArray from './useFieldArray'

export interface FieldProps {
  component?: any
  fieldId: string
  render?: (props: object) => any
  [x: string]: any
}

const FieldArrayContainer: React.SFC<FieldProps> = ({ component, render, fieldId, ...rest }) => {
  if (!component && !render) {
    throw new Error('The FieldArray needs a "component" or a "render" property to  function correctly.')
  }
  if (!fieldId || typeof fieldId !== 'string') {
    throw new Error('The FieldArray needs a valid "fieldId" property to  function correctly.')
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
    ...rest,
  }

  return component ? React.createElement(component, props) : render && render(props)
}

export default FieldArrayContainer

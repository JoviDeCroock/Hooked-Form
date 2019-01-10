import * as React from 'react'
import useField from './useField'

export interface FieldProps {
  component: any
  fieldId: string
  innerRef?: () => void
  [x: string]: any
}

const FieldContainer: React.SFC<FieldProps> = ({ component, fieldId, innerRef, ...rest }) => {
  if (!component) {
    throw new Error('The Field needs a "component" property to  function correctly.')
  }
  if (!fieldId || typeof fieldId !== 'string') {
    throw new Error('The Field needs a valid "fieldId" property to  function correctly.')
  }

  const {
    0: { onChange, onBlur, onFocus, resetField: resetFieldValue },
    1: { error, touched: isFieldTouched, value },
  } = useField(fieldId)
  const props = {
    error,
    onBlur,
    onChange,
    onFocus,
    ref: innerRef,
    reset: resetFieldValue,
    touched: isFieldTouched,
    value: value || '',
    ...rest,
  }
  return React.createElement(component, props)
}

export default FieldContainer

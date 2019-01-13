import * as React from 'react'

import { areEqualMemoizedField } from './helpers/areEqual';
import useField from './useField'

export interface FieldProps {
  component: any
  efficient?: boolean;
  fieldId: string
  innerRef?: () => void
  [x: string]: any
}

const FieldContainer: React.SFC<FieldProps> = React.memo(({ component, efficient, fieldId, innerRef, ...rest }) => {
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
  const element = React.createElement(component, props)
  return efficient ?
    React.useMemo(
      () => element,
      [value, error, onChange, isFieldTouched]
    ) : element;
}, areEqualMemoizedField)

export default FieldContainer

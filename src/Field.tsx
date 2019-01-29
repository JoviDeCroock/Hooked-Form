import * as React from 'react'

import { areEqualMemoizedField } from './helpers/areEqual';
import useField from './useField'

export interface FieldProps {
  component: any
  fieldId: string
  innerRef?: () => void
  watchableProps?: Array<string>
  [x: string]: any
}

const FieldContainer: React.FC<FieldProps> = React.memo(({ component, fieldId, innerRef, watchableProps, ...rest }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!component) { throw new Error('The Field needs a "component" property to  function correctly.') }
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

  return React.useMemo(
    () => React.createElement(component, props),
    [value, error, isFieldTouched, ...((watchableProps || ['disabled', 'className']).map((key: string) => rest[key]))]
  );
}, areEqualMemoizedField)

export default FieldContainer

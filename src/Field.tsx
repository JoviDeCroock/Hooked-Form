import * as React from 'react'
import { formContext } from './helpers/context'
import { get } from './helpers/operations'
import reset from './helpers/reset'

interface FieldProps {
  component: any
  fieldId: string
  innerRef?: () => void
  [x: string]: any
}

const FieldContainer = ({ component, fieldId, innerRef, ...rest }: FieldProps) => {
  if (!component) {
    throw new Error('The Field needs a "component" property to  function correctly.')
  }

  if (!fieldId || typeof fieldId !== 'string') {
    throw new Error('The Field needs a valid "fieldId" property to  function correctly.')
  }

  const {
    errors,
    initialValues,
    values,
    setFieldValue,
    setFieldTouched,
  } = React.useContext(formContext)

  const error = React.useMemo(() => get(errors, fieldId), [errors, fieldId])
  const initialValue = React.useMemo(() => get(initialValues, fieldId), [initialValues, fieldId])
  const value = React.useMemo(() => get(values, fieldId), [values, fieldId])

  const resetFieldValue = React.useCallback(() => {
    setFieldValue(fieldId, initialValue || reset(value))
    setFieldTouched(fieldId, false)
  }, [value])

  const onChange = React.useMemo(() => (val: any) => setFieldValue(fieldId, val), [fieldId])
  const onBlur = React.useMemo(() => setFieldTouched.bind(null, fieldId), [fieldId])

  const props = {
    error,
    onBlur,
    onChange,
    ref: innerRef,
    reset: resetFieldValue,
    value: value || '',
    ...rest,
  }

  return React.createElement(component, props)
}

export default FieldContainer

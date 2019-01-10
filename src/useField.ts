import * as React from 'react'
import { formContext } from './helpers/context'
import { get } from './helpers/operations'
import reset from './helpers/reset'

export interface FieldOperations {
  onBlur: () => void
  onChange: (value: any) => void
  onFocus: () => void
  setFieldValue: (fieldId: string, value: any) => void
  resetField: () => void
}

export interface FieldInformation {
  error: string
  touched: boolean
  value: any
}

export default function useField(fieldId: string): [FieldOperations, FieldInformation] {
  const {
    errors,
    initialValues,
    values,
    setFieldValue,
    setFieldTouched,
    touched,
  } = React.useContext(formContext)

  const error = React.useMemo(() => get(errors, fieldId), [errors, fieldId])
  const initialValue = React.useMemo(() => get(initialValues, fieldId), [initialValues, fieldId])
  const value = React.useMemo(() => get(values, fieldId), [values, fieldId])
  const isFieldTouched = React.useMemo(() => get(touched, fieldId), [touched, fieldId])
  const resetFieldValue = React.useCallback(() => {
    setFieldValue(fieldId, initialValue || reset(value))
    setFieldTouched(fieldId, false)
  }, [value])
  const onChange = React.useMemo(() => (val: any) => setFieldValue(fieldId, val), [fieldId])
  const onBlur = React.useMemo(() => setFieldTouched.bind(null, fieldId, true), [fieldId])
  const onFocus = React.useMemo(() => setFieldTouched.bind(null, fieldId, false), [fieldId])

  return [
    { onChange, onBlur, onFocus, resetField: resetFieldValue, setFieldValue },
    { error, touched: isFieldTouched, value },
  ]
}

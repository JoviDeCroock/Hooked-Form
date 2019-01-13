import * as React from 'react'
import { add, insert, move, remove, replace, swap } from './helpers/arrays'
import { formContext } from './helpers/context'
import { get } from './helpers/operations'
import reset from './helpers/reset'

export interface FieldOperations {
  addElement: (item: any) => void
  insertElement: (at: number, element: object) => void
  moveElement: (from: number, to: number) => void
  setFieldValue: (fieldId: string, value: any) => void
  removeElement: (toDelete: object | number) => void
  replaceElement: (at: number, element: object) => void
  resetField: () => void
  swapElement: (first: number, second: number) => void
}

export interface FieldInformation {
  error: string | null
  value: any
}

export default function useFieldArray(fieldId: string): [FieldOperations, FieldInformation] {
  const { errors, initialValues, values, setFieldValue } = React.useContext(formContext)
  const error = React.useMemo(() => get(errors, fieldId), [errors])
  const initialValue = React.useMemo(() => get(initialValues, fieldId), [initialValues])
  const value: Array<any> = React.useMemo(() => get(values, fieldId) || [], [values,])

  value.map = React.useCallback((callback) => {
    const array: Array<any> = []
    value.forEach((element: any, i: number) => {
      const el = callback(element, `${fieldId}[${i}]`, i)
      array.push(el)
    })
    return array
  }, [value])

  const resetFieldValue = React.useCallback(() => { setFieldValue(fieldId, initialValue || reset(value)) }, [value])
  const addElement = React.useCallback((element: any = {}) => { setFieldValue(fieldId, add(value, element)) }, [value])
  const swapElement = React.useCallback((first: number, second: number) => { setFieldValue(fieldId, swap(value, first, second)) }, [value])
  const insertElement = React.useCallback((at: number, element: object) => { setFieldValue(fieldId, insert(value, at, element)) }, [value])
  const moveElement = React.useCallback((from: number, to: number) => { setFieldValue(fieldId, move(value, from, to)) }, [value])
  const removeElement = React.useCallback((toDelete: object | number) => { setFieldValue(fieldId, remove(value, toDelete)) }, [value])
  const replaceElement = React.useCallback((at: number, element: object) => { setFieldValue(fieldId, replace(value, at, element)) }, [value])

  return [
    {
      addElement, insertElement, moveElement,
      removeElement, replaceElement, resetField: resetFieldValue,
      setFieldValue, swapElement,
    },
    { error, value },
  ]
}

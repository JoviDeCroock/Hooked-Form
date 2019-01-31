import * as React from 'react'
import { formContext } from './helpers/context'
import { get } from './helpers/operations'

export interface FieldInformation {
  error: string
}

export default function useError(fieldId: string): string | null {
  if (process.env.NODE_ENV !== 'production') {
    if (!fieldId || typeof fieldId !== 'string') { throw new Error('The FieldArray needs a valid "fieldId" property to  function correctly.') }
  }
  const { errors } = React.useContext(formContext)
  const error = React.useMemo(() => get(errors, fieldId), [errors])
  return error
}

import * as React from 'react'
import { formContext } from './helpers/context'
import { get } from './helpers/operations'

export interface FieldInformation {
  error: string
}

export default function useError(fieldId: string): string | null {
  const { errors } = React.useContext(formContext)
  const error = React.useMemo(() => get(errors, fieldId), [errors])
  return error
}

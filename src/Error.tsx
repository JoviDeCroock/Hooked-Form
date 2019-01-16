import * as React from 'react'
import useError from './useError'

export interface FieldProps {
  component: any
  fieldId: string
  [x: string]: any
}

const ErrorContainer: React.FC<FieldProps> = React.memo(({ component, fieldId }) => {
  if (!component) { throw new Error('The Field needs a "component" property to  function correctly.') }
  if (!fieldId || typeof fieldId !== 'string') { throw new Error('The Field needs a valid "fieldId" property to  function correctly.') }
  const error = useError(fieldId)
  const props = { error }
  return React.useMemo(() => React.createElement(component, props), [error])
}, () => true)

export default ErrorContainer

import * as React from 'react'
import useError from './useError'

export interface FieldProps {
  component: any
  fieldId: string
  [x: string]: any
}

const ErrorContainer: React.FC<FieldProps> = React.memo(({ component, fieldId }) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!component) { throw new Error('The Field needs a "component" property to  function correctly.') }
  }
  const error = useError(fieldId)
  return React.useMemo(() => React.createElement(component, { error }), [error])
}, () => true)

export default ErrorContainer

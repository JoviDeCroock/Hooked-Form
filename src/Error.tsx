import * as React from 'react'
import useError from './useError'

export interface FieldProps {
  component: any
  fieldId: string
  [x: string]: any
}

const ErrorContainer: React.SFC<FieldProps> = ({ component, fieldId, ...rest }) => {
  if (!component) { throw new Error('The Field needs a "component" property to  function correctly.') }
  if (!fieldId || typeof fieldId !== 'string') { throw new Error('The Field needs a valid "fieldId" property to  function correctly.') }

  const error = useError(fieldId)
  const props = { error, ...rest }
  return React.createElement(component, props)
}

export default ErrorContainer

import * as React from 'react'
import { FormHookContext } from '../types'

export const formContext = React.createContext<FormHookContext>({} as any)
const { Consumer, Provider } = formContext;

export { Consumer, Provider };

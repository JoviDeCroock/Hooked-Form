import * as React from 'react';
import { FormHookContext } from '../types';

export const formContext = React.createContext<FormHookContext>({} as any);
export const { Consumer, Provider } = formContext;

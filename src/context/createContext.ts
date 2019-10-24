import * as React from 'react';
import { FormHookContext } from '../types';

export const context: any = React.createContext<FormHookContext>(null as any, () => 0);
export const { Provider } = context;

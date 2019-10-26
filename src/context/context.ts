import * as React from 'React';
import { FormHookContext } from '../types';

export const formContext: any = React.createContext<FormHookContext>(undefined as any, () => 0);
export const { Provider } = formContext;

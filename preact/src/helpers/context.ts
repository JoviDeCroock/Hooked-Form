import { createContext } from 'preact';
import { FormHookContext } from '../types';

export const formContext = createContext<FormHookContext>({} as any);
const { Consumer, Provider } = formContext;
export { Consumer, Provider };

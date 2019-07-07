import { createContext } from 'use-context-selector';
import { FormHookContext } from '../types';

export const formContext = createContext<FormHookContext>({} as any);
const { Provider } = formContext;
export { Provider };

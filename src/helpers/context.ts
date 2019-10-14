import { createContext } from '../context/createContext';
import { FormHookContext } from '../types';

export const formContext = createContext<FormHookContext>();
const { Provider } = formContext;
export { Provider };

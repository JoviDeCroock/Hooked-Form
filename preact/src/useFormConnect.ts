import { useContext } from 'preact/hooks';
import { formContext } from './Form';
import { FormHookContext } from './types';

export const useFormConnect = (): FormHookContext => useContext(formContext);

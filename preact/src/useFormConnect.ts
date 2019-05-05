import { useContext } from 'preact/hooks';
import { formContext } from './context';
import { FormHookContext } from './types';

export default (): FormHookContext => useContext(formContext);

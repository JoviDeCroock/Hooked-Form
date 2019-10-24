import { useContext } from 'react';
import { formContext } from './helpers/context';
import { FormHookContext } from './types';

export default (): FormHookContext => useContext(formContext);

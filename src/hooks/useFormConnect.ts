import { useContext } from 'react';
import { FormHookContext } from '../types';
import { formContext } from '../Form';

export default (): FormHookContext => useContext(formContext);

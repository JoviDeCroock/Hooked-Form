import { useSelector } from './context/useSelector';
import { formContext } from './helpers/context';
import { FormHookContext } from './types';

export default (): FormHookContext => useSelector(formContext, (form: any) => form);

import { useSelector } from './context/useSelector';
import { FormHookContext } from './types';

export default (): FormHookContext => useSelector((ctx: any) => ctx);

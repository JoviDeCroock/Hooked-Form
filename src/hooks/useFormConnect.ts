import { FormHookContext } from '../types';
import { useContextEmitter } from './useContextEmitter';

export default (): FormHookContext => useContextEmitter('*');

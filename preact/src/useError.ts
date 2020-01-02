import { get } from './helpers/operations';
import {useFormConnect} from './useFormConnect';

export interface FieldInformation {
  error: string;
}

export function useError(fieldId: string): string | null {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Error needs a valid "fieldId" property to function correctly.');
  }

  return get(useFormConnect().errors, fieldId);
}

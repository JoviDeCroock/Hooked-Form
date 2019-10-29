import { get } from './helpers/operations';
import { useContextEmitter } from './useContextEmitter';

export interface FieldInformation {
  error: string;
}

export default function useError(fieldId: string): string | null {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Error needs a valid "fieldId" property to function correctly.');
  }

  return get(useContextEmitter(fieldId).errors, fieldId);
}

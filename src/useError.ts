import { useSelector } from './context/useSelector';
import { formContext } from './helpers/context';
import { get } from './helpers/operations';
import { FormHookContext } from './types';

export interface FieldInformation {
  error: string;
}

export default function useError(fieldId: string): string | null {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Error needs a valid "fieldId" property to function correctly.');
  }
  return useSelector(
    (ctx: FormHookContext) => get(ctx.errors, fieldId),
  );
}

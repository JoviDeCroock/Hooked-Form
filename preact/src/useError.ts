import { useContext, useDebugValue, useMemo } from 'preact/hooks';
import { formContext } from './context';
import { get } from './helpers/operations';

export interface FieldInformation {
  error: string;
}

export default function useError(fieldId: string): string | null {
  const { errors } = useContext(formContext);
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Error needs a valid "fieldId" property to  function correctly.');
  }

  if (process.env.NODE_ENV !== 'production') {
    useDebugValue(`${fieldId} Error: ${get(errors, fieldId)}`);
  }
  return useMemo(() => get(errors, fieldId), [errors]);
}

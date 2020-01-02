import { get } from './helpers/operations';
import { useFormConnect } from './useFormConnect';

export interface FieldOperations<T> {
  onBlur: () => void;
  onChange: (value: T) => void;
  onFocus: () => void;
}

export interface FieldInformation<T> {
  error: string;
  touched: boolean;
  value: T;
}

export function useField<T = any>(
  fieldId: string,
): [FieldOperations<T>, FieldInformation<T>] {
  if (process.env.NODE_ENV !== 'production' && (!fieldId || typeof fieldId !== 'string')) {
    throw new Error('The Field needs a valid "fieldId" property to function correctly.');
  }

  const ctx = useFormConnect();
  return [
    {
      onBlur:() => {
        ctx.setFieldTouched(fieldId, true);
      },
      onChange:(value: T) => {
        ctx.setFieldValue(fieldId, value);
      },
      onFocus:() => {
        ctx.setFieldTouched(fieldId, false);
      },
    },
    {
      error: get(ctx.errors, fieldId),
      touched: get(ctx.touched, fieldId),
      value: get(ctx.values, fieldId) || '',
    },
  ];
}

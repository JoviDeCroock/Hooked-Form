import { get } from './helpers/operations';
import { FieldInformation } from './types';
import { useContextEmitter } from './useContextEmitter';

export interface FieldOperations<T> {
  onBlur: () => void;
  onChange: (value: T) => void;
  onFocus: () => void;
}

export interface FieldOptions<T> {
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validate?: (value: T) => string | null | undefined;
}

export default function useField<T = any>(
  fieldId: string,
  options?: FieldOptions<T>
): [FieldOperations<T>, FieldInformation<T>] {
  if (
    process.env.NODE_ENV !== 'production' &&
    (!fieldId || typeof fieldId !== 'string')
  ) {
    throw new Error(
      'The Field needs a valid "fieldId" property to function correctly.'
    );
  }

  const ctx = useContextEmitter(fieldId);
  const val = get(ctx.values, fieldId);
  const fieldOptions = options || {};

  return [
    {
      onBlur: () => {
        ctx.setFieldTouched(fieldId, true);
        if (
          (fieldOptions.validateOnBlur === undefined
            ? true
            : fieldOptions.validateOnBlur) &&
          fieldOptions.validate
        ) {
          const error = fieldOptions.validate(val);
          if (error) ctx.setFieldError(fieldId, error);
        }
      },
      onChange: (value: T) => {
        ctx.setFieldValue(fieldId, value);
        if (fieldOptions.validateOnChange && fieldOptions.validate) {
          const error = fieldOptions.validate(value);
          if (error) ctx.setFieldError(fieldId, error);
        }
      },
      onFocus: () => {
        ctx.setFieldTouched(fieldId, false);
      },
    },
    {
      error: get(ctx.errors, fieldId),
      touched: get(ctx.touched, fieldId),
      value: val || '',
    },
  ];
}

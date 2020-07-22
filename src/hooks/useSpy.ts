import * as React from 'react';
import { get } from '../helpers/operations';
import { FieldInformation, FormHookContext } from '../types';
import { formContext } from '../Form';

export type SpyCallback<T> = (newValue: T, ctx: FormHookContext) => void;

export default function useSpy<T = any>(
  fieldId: string,
  cb?: SpyCallback<T>
): FieldInformation<T> {
  const ctx = React.useContext(formContext);
  const isMounted = React.useRef<boolean>(false);
  const prev = React.useRef<T>();

  const value = get(ctx.values, fieldId);

  React.useEffect(() => {
    if (isMounted.current && cb && prev.current !== value) cb(value, ctx);
    isMounted.current = true;
    prev.current = value;
  }, [value]);

  return {
    error: get(ctx.errors, fieldId),
    touched: get(ctx.touched, fieldId),
    value,
  };
}

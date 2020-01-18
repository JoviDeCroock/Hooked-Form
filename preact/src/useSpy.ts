import { useEffect, useRef } from 'preact/hooks';
import { get } from './helpers/operations';
import { FormHookContext } from './types';
import { useFormConnect } from './useFormConnect';

export const useSpy = (
  fieldId: string,
  cb: (newValue: any, ctx: FormHookContext) => void
) => {
  const isMounted = useRef<boolean | undefined>();
  const ctx = useFormConnect();
  const value = get(ctx.values, fieldId);
  useEffect(() => {
    if (isMounted.current) cb(get(ctx.values, fieldId), ctx);
    (isMounted as any).current = true;
  }, [get(ctx.values, fieldId)]);

  return {
    error: get(ctx.errors, fieldId),
    touched: get(ctx.touched, fieldId),
    value,
  };
};

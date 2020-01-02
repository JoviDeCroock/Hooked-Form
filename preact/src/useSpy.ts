import { useEffect, useRef } from 'preact/hooks';
import { get } from './helpers/operations';
import { FormHookContext } from './types';
import {useFormConnect} from './useFormConnect';

export const useSpy = (fieldId: string, cb: (newValue: any, ctx: FormHookContext) => void) => {
  const isMounted = useRef<undefined | boolean>();
  const ctx = useFormConnect();
  useEffect(() => {
    if (isMounted.current) cb(get(ctx.values, fieldId), ctx);
    // @ts-ignore
    isMounted.current = true;
  }, [get(ctx.values, fieldId)]);
};

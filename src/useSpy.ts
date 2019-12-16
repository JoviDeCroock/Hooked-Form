import * as React from 'react';
import { get } from './helpers/operations';
import { FormHookContext } from './types';
import { useContextEmitter } from './useContextEmitter';

export type SpyCallback<T> = (newValue: T, ctx: FormHookContext) => void;

export default function useSpy<T = any>(
  fieldId: string,
  cb?: SpyCallback<T>
): [T, FormHookContext] {
  const isMounted = React.useRef<boolean>(false);
  const ctx = useContextEmitter(fieldId);
  const value = get(ctx.values, fieldId);

  React.useEffect(() => {
    if (isMounted.current && cb) cb(value, ctx);
    isMounted.current = true;
  }, [value]);

  return [value, ctx];
}

import * as React from 'react';
import { get } from './helpers/operations';
import { FormHookContext } from './types';
import { useContextEmitter } from './useContextEmitter';

const useSpy = (
  fieldId: string,
  cb: (newValue: any, ctx: FormHookContext) => void
) => {
  const isMounted = React.useRef<undefined | boolean>();
  const ctx = useContextEmitter(fieldId);
  const value = get(ctx.values, fieldId);

  React.useEffect(() => {
    if (isMounted.current) cb(value, ctx);
    isMounted.current = true;
  }, [value]);

  return { value };
};

export default useSpy;

import * as React from 'react';
import { get } from './helpers/operations';
import { FormHookContext } from './types';
import { useContextEmitter } from './useContextEmitter';

const useSpy = (fieldId: string, cb: (newValue: any, ctx: FormHookContext) => void) => {
  const isMounted = React.useRef<undefined | boolean>();
  const ctx = useContextEmitter(fieldId);
  React.useEffect(() => {
    if (isMounted.current) cb(get(ctx.values, fieldId), ctx);
    isMounted.current = true;
  }, [get(ctx.values, fieldId)]);
};

export default useSpy;

import * as React from 'react';

export const keyword = 'hooked-form';

export function createContext<T = any>() {
  const context: any = React.createContext<T>(null as any, () => 0);
  const { Provider } = context;
  context[keyword] = [];
  context.Provider = React.memo(({ value, children }: any) => {
    context[keyword].forEach((listener: Function) => { listener(value) });
    return React.createElement(Provider, { value }, children);
  });
  return context;
};

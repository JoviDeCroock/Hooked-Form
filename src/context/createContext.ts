import * as React from 'react';

export const keyword = '__HF';
// TODO: this can be optimised as an iife.
export function createContext<T = any>() {
  const context: any = React.createContext<T>(null as any, () => 0);
  const { Provider } = context;
  context[keyword] = [];
  context.Provider = React.memo((props: any) => {
    context[keyword].forEach((listener: (val: any) => any) => { listener(props.value); });
    return React.createElement(Provider, { value: props.value }, props.children);
  });
  return context;
}

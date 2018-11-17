import * as React from "react";

export default (initial: object = {}): [object, (id: string, value: any) => object, (newState: object) => void] => {
  const { 0: values, 1: innerSetValue } = React.useState(initial);
  const setValue = (id: string, value: any) => {
    const newState = { ...values, [id]: value };
    innerSetValue(newState);
    return newState;
  }
  const setState = (newState: object) => innerSetValue(() => ({ ...newState }));
  return [values, setValue, setState];
};

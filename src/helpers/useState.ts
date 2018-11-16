import { useState } from "react";

export default (initial: object = {}): [object, (id: string, value: any) => void, (newState: object) => void] => {
  const [values, innerSetValue] = useState(initial);
  const setValue = (id: string, value: any) => innerSetValue({ ...values, [id]: value });
  const setState = (newState: object) => innerSetValue(() => ({ ...newState }));
  return [values, setValue, setState];
};

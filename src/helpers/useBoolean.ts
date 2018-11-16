import { useState } from "react";

export default (initial: boolean = true): [(value: boolean) => void, boolean] => {
  const { 0: value, 1: setValue } = useState(initial);
  return [
    setValue,
    value,
  ];
};

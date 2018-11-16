import { useState } from "react";

interface CounterOptions {
  step?: number
}

export default (initial: Object = {}) => {
  const [values, setValue] = useState(initial);
  return {
    setFieldValue: (fieldId, value) => setValue({ ...values, [fieldId]: value }),
    values,
  }
};

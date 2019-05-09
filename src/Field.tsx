import * as React from 'react';

import useField from './useField';

interface Props {
  watchAbleProps?: Array<string>;
  [fieldId: string]: any;
}

export interface FieldProps {
  component: any;
  fieldId: string;
  innerRef?: () => void;
  watchableProps?: Array<string>;
  [x: string]: any;
}

const FieldContainer: React.FC<FieldProps> = (
  { component, fieldId, innerRef, watchableProps, ...rest },
) => {
  if (process.env.NODE_ENV !== 'production' && !component) {
    throw new Error('The Field needs a "component" property to  function correctly.');
  }

  const {
    0: { onChange, onBlur, onFocus },
    1: { error, touched: isFieldTouched, value },
  } = useField(fieldId);

  return React.useMemo(
    () => React.createElement(component, {
      error,
      onBlur,
      onChange,
      onFocus,
      ref: innerRef,
      touched: isFieldTouched,
      value,
      ...rest,
    }),
    [
      value, error, isFieldTouched,
      ...((watchableProps || ['disabled', 'className']).map((key: string) => rest[key])),
    ],
  );
};

export default FieldContainer;

export interface Values {
  [fieldId: string]: any;
}

export interface Touched {
  [fieldId: string]: boolean;
}

export interface Errors {
  [fieldId: string]: string | Array<Errors>;
}

export interface InitialValues {
  [fieldId: string]: any;
}

export interface FormHookContext {
  errors: Errors;
  isDirty?: boolean;
  formError?: string | null;
  setFieldValue: (fieldId: string, value: any) => void;
  setFieldTouched: (fieldId: string, value: any) => void;
  touched: Touched;
  validate: () => object;
  values: Values;
}

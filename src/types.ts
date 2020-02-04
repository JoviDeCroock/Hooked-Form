export interface Values {
  [fieldId: string]: any;
}

export interface Touched {
  [fieldId: string]: boolean;
}

export interface Errors {
  [fieldId: string]: string | Array<Errors>;
}

export interface FormHookContext {
  errors: Errors;
  isDirty?: boolean;
  formError?: string | null;
  isSubmitting: boolean;
  resetForm: () => void;
  setFieldError: (fieldId: string, error: any) => void;
  setFieldValue: (fieldId: string, value: any) => void;
  setFieldTouched: (fieldId: string, touched: boolean) => void;
  submit: () => void;
  touched: Touched;
  validate: () => object;
  values: Values;
}

export interface FieldInformation<T> {
  error: string;
  touched: boolean;
  value: T;
}

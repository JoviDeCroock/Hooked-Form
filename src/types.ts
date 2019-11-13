export interface Values {
  [fieldId: string]: any;
}

export interface Touched {
  [fieldId: string]: boolean;
}

export type Error = string | Array<Errors>;

export interface Errors {
  [fieldId: string]: Error;
}

export interface InitialValues {
  [fieldId: string]: any;
}

export interface FormHookContext {
  errors: Errors;
  isDirty?: boolean;
  formError?: string | null;
  isSubmitting: boolean;
  resetForm: () => void;
  setFieldValue: (fieldId: string, value: any) => void;
  setFieldTouched: (fieldId: string, value: any) => void;
  setFieldError: (fieldId: string, error: string | Array<Errors>) => void;
  submit: () => void;
  touched: Touched;
  validate: () => object;
  values: Values;
}

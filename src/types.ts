import { Force } from './context/emitter';

export interface Values {
  [fieldId: string]: any;
}

export interface Touched {
  [fieldId: string]: boolean;
}

export interface Errors {
  [fieldId: string]: string | Array<Errors>;
}

export type ValidationTuple = [string, (value: any) => string | undefined];

export interface FormHookContext {
  errors: Errors;
  isDirty?: boolean;
  formError?: string | null;
  isSubmitting: boolean;
  resetForm: () => void;
  setFieldError: (fieldId: string, error?: string | undefined) => void;
  setFieldValue: (fieldId: string, value: any) => void;
  setFieldTouched: (fieldId: string, touched: boolean) => void;
  submit: () => void;
  touched: Touched;
  validate: () => object;
  values: Values;
}

export type PrivateFormHookContext = FormHookContext & {
  _on: (fieldId: string, cb: Force) => void;
  _fieldValidators: ValidationTuple[];
};

export type ArrayHookContext = PrivateFormHookContext & {
  _getErrors: () => { current: Errors };
  _getTouched: () => { current: Touched };
  _getValues: () => { current: Values };
};

export interface FieldInformation<T> {
  error: string;
  touched: boolean;
  value: T;
}

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

export interface SuccessBag {
  resetForm: () => void;
}

export interface ErrorBag {
  setErrors: (errors: Errors) => void;
  setFormError: (error: string) => void;
}

export interface CallBag {
  props?: object;
  setErrors: (errors: Errors) => void;
  setFormError: (error: string) => void;
}

export interface Payload {
  change: (fieldId: string, value: any) => void;
  formError?: string | null;
  isDirty?: boolean | null;
  isSubmitting?: boolean | null;
  handleSubmit: (e?: React.SyntheticEvent) => void;
  resetForm: () => void;
}

export interface FormOptions<T>
  extends Omit<React.HTMLProps<HTMLFormElement>, 'onSubmit' | 'onError'> {
  children?: ((form: Payload) => React.ReactNode) | React.ReactNode;
  enableReinitialize?: boolean;
  initialErrors?: Errors;
  initialValues?: Partial<T>;
  noForm?: boolean;
  onError?: (error: object, callbag: ErrorBag) => void;
  onSuccess?: (result: any, callbag: SuccessBag) => void;
  onSubmit: (values: Partial<T>, callbag: CallBag) => Promise<any> | any;
  shouldSubmitWhenInvalid?: boolean;
  validate?: (values: Partial<T>) => object | undefined;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
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
  on: (fieldId: string, cb: Force) => void;
  fieldValidators: ValidationTuple[];
}

export interface FieldInformation<T> {
  error: string;
  touched: boolean;
  value: T;
}

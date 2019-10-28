import * as React from 'react';
import { emit } from './context/emitter';
import { deriveInitial } from './helpers/deriveInitial';
import { deriveKeys } from './helpers/deriveKeys';
import useState from './helpers/useState';
import { Errors, FormHookContext, InitialValues, Touched } from './types';

export const formContext = React.createContext<FormHookContext>(null as any, () => 0);

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

export interface FormOptions<T> {
  children?: any;
  enableReinitialize?: boolean;
  initialValues?: InitialValues;
  mapPropsToValues?: (props: object) => InitialValues;
  noForm?: boolean;
  onError?: (error: object, callbag: ErrorBag) => void;
  onSuccess?: (result: any, callbag: SuccessBag) => void;
  onSubmit: (values: Partial<T>, callbag: CallBag) => Promise<any> | any;
  shouldSubmitWhenInvalid?: boolean;
  validate?: (values: Partial<T>) => object;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

export const EMPTY_OBJ = {};

const Form = <Values extends object>({
  children,
  enableReinitialize,
  initialValues,
  onSubmit,
  noForm,
  validate,
  onError,
  onSuccess,
  shouldSubmitWhenInvalid,
  validateOnBlur,
  validateOnChange,
  ...formProps // used to inject className, onKeyDown and related on the <form>
}: FormOptions<Values>) => {
  const { 0: values, 1: setFieldValue, 2: setValuesState } = useState(initialValues || EMPTY_OBJ);
  const { 0: touched, 1: touch, 2: setTouchedState } = useState(EMPTY_OBJ);
  const { 0: formErrors, 2: setErrorState } = useState(EMPTY_OBJ);
  const { 0: isSubmitting, 1: setSubmitting } = React.useState(false);
  const { 0: formError, 1: setFormError } = React.useState();

  const isDirty = React.useRef(false);

  // The validation step in our form, this memoization happens on values and touched.
  const validateForm = React.useCallback(() => {
    const validationErrors = validate ? validate(values) : EMPTY_OBJ;
    setErrorState(validationErrors);
    emit(([] as Array<string>).concat(
      deriveKeys(validationErrors || EMPTY_OBJ),
      deriveKeys(formErrors || EMPTY_OBJ),
    ));
    return validationErrors;
  }, [values]);

  // Provide a way to reset the full form to the initialValues.
  const resetForm = React.useCallback(() => {
    isDirty.current = false;
    emit(([] as Array<string>).concat(
      deriveKeys(initialValues || EMPTY_OBJ),
      deriveKeys(values),
    ));
    setValuesState(initialValues || EMPTY_OBJ);
    setTouchedState(EMPTY_OBJ);
    setErrorState(EMPTY_OBJ);
  }, [initialValues]);

  const handleSubmit = React.useCallback(
    async (event?: React.FormEvent<HTMLFormElement>) => {
      if (event && event.preventDefault) event.preventDefault();

      const errors = validateForm();
      setTouchedState(deriveInitial(errors, true));
      if (!shouldSubmitWhenInvalid && Object.keys(errors).length > 0) {
        setSubmitting(false);
        return emit('submitting');
      }

      const setFormErr = (err: string) => {
        setFormError(err);
        emit('formError');
      };

      return new Promise(resolve => resolve(
        onSubmit(values, { setErrors: setErrorState, setFormError: setFormErr })))
          .then((result: any) => {
            setSubmitting(false);
            emit('submitting');
            if (onSuccess) onSuccess(result, { resetForm });
          })
          .catch((e: any) => {
            setSubmitting(false);
            emit('submitting');
            if (onError) onError(e, { setErrors: setErrorState, setFormError: setFormErr });
          });
    },
    [values],
  );

  React.useEffect(() => {
    if (isSubmitting) handleSubmit();
  }, [isSubmitting]);

  // Make our listener for the reinitialization when need be.
  React.useEffect(() => {
    if (enableReinitialize) resetForm();
  }, [initialValues]);

  // Run validations when needed.
  React.useEffect(() => {
    validateForm();
  }, [validateOnBlur && touched, validateOnChange && values]);

  // The onChange we can use for our Fields,
  // should also be renewed context wise when our touched are altered.
  const onChange = React.useCallback((fieldId: string, value: any) => {
    isDirty.current = true;
    setFieldValue(fieldId, value);
    emit(fieldId);
  }, []);

  const submit = React.useCallback((e?: React.SyntheticEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitting(() => true);
    emit('submitting');
  }, []);

  const providerValue = React.useMemo(
    () => ({
      errors: formErrors as Errors,
      formError,
      isDirty: isDirty.current,
      isSubmitting,
      resetForm,
      setFieldTouched: (fieldId: string, value?: boolean) => {
        emit(fieldId);
        touch(fieldId, value == null ? true : value);
      },
      setFieldValue: onChange,
      submit,
      touched: touched as Touched,
      validate: validateForm,
      values,
    }),
    [
      formErrors, formError, onChange, touched,
      validateForm, values, resetForm, isSubmitting,
    ],
  );

  return (
    <formContext.Provider value={providerValue}>
      {noForm ?
        children :
        <form onSubmit={submit} {...formProps}>
          {children}
        </form>
      }
    </formContext.Provider>
  );
};

export default Form;

import * as React from 'react';
import { emit } from './context/emitter';
import { deriveInitial } from './helpers/deriveInitial';
import { deriveKeys } from './helpers/deriveKeys';
import useState from './helpers/useState';
import { Errors, FormHookContext, InitialValues, Touched } from './types';

export const formContext = React.createContext<FormHookContext>(
  null as any,
  () => 0
);

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

export interface FormOptions<T> {
  children?: ((form: Payload) => React.ReactNode) | React.ReactNode;
  enableReinitialize?: boolean;
  initialErrors?: Errors;
  initialValues?: InitialValues;
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
  initialErrors,
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
  const { 0: values, 1: setFieldValue, 2: setValuesState } = useState(
    initialValues
  );
  const { 0: touched, 1: touch, 2: setTouchedState } = useState(
    initialErrors && (() => deriveInitial(initialErrors, true))
  );
  const { 0: errors, 1: setFieldError, 2: setErrorState } = useState(
    initialErrors
  );
  const { 0: isSubmitting, 1: setSubmitting } = React.useState(false);
  const { 0: formError, 1: setFormError } = React.useState();

  const isDirty = React.useRef(false);

  // The callback to validate our form
  const validateForm = () => {
    // TO prevent a rerender when we have no validate function and it gets called
    // we reuse the EMPTY_OBJ since this implies equality for the state-hook and
    // triggers no render.
    const validationErrors = validate ? validate(values) : EMPTY_OBJ;
    setErrorState(validationErrors);
    emit(
      ([] as Array<string>).concat(
        // We concat current and new errors to ensure everything
        // Will be proparly rerendered.
        deriveKeys(validationErrors || EMPTY_OBJ),
        deriveKeys(errors || EMPTY_OBJ)
      )
    );
    // We return so we can use this in submit without having to rely
    // on the state being set.
    return validationErrors;
  };

  // Provide a way to reset the full form to the initialValues.
  const resetForm = () => {
    isDirty.current = false;
    setValuesState(initialValues);
    setTouchedState(initialErrors && deriveInitial(initialErrors, true));
    setErrorState(initialErrors);
    emit(
      ([] as Array<string>).concat(
        // We concat current and new values to ensure everything
        // Will be proparly rerendered.
        deriveKeys(initialValues || EMPTY_OBJ),
        deriveKeys(values)
      )
    );
  };

  const handleSubmit = () => {
    // Validate our form
    const fieldErrors = validateForm();
    // Use the fieldErrors to set touched state on these fields in case
    // the consumer is checking touched && error ? showError() : null
    setTouchedState(deriveInitial(fieldErrors, true));
    // If we should skip submitting when invalid AND we have fieldErrors go in here
    if (!shouldSubmitWhenInvalid && deriveKeys(fieldErrors).length > 0) {
      setSubmitting(false);
      return emit('s');
    }

    const setFormErr = (err: string) => {
      setFormError(err);
      emit('f');
    };

    return new Promise(resolve =>
      resolve(
        onSubmit(values, { setErrors: setErrorState, setFormError: setFormErr })
      )
    )
      .then((result: any) => {
        setSubmitting(false);
        emit('s');
        if (onSuccess) onSuccess(result, { resetForm });
      })
      .catch((e: any) => {
        setSubmitting(false);
        emit('s');
        if (onError)
          onError(e, { setErrors: setErrorState, setFormError: setFormErr });
      });
  };

  // triggers a submit.
  const submit = (e?: React.SyntheticEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitting(true);
    emit('s');
  };

  React.useEffect(() => {
    // This convenience method ensures we don't have to pass handleSubmit
    // to the context/childComponent (since this rebinds on every value change)
    // This avoids a lot of rerenders
    if (isSubmitting) handleSubmit();
  }, [isSubmitting]);

  // Make our listener for the reinitialization when need be.
  React.useEffect(() => {
    if (enableReinitialize) resetForm();
  }, [initialValues]);

  // Run validations when needed.
  React.useEffect(() => {
    if (
      (validateOnBlur === undefined || validateOnChange || validateOnBlur) &&
      isDirty.current
    ) {
      validateForm();
    }
  }, [
    validateOnBlur === undefined ? touched : validateOnBlur && touched,
    validateOnChange && values,
    isDirty.current,
  ]);

  const change = (fieldId: string, value: any) => {
    isDirty.current = true;
    setFieldValue(fieldId, value);
    emit(fieldId);
  };

  const toRender =
    typeof children === 'function'
      ? children({
          change,
          formError,
          isDirty: isDirty.current,
          isSubmitting,
          handleSubmit: submit,
          resetForm,
        })
      : children;

  return (
    <formContext.Provider
      value={{
        errors: errors as Errors,
        formError,
        isDirty: isDirty.current,
        isSubmitting,
        resetForm,
        setFieldError: (fieldId: string, error?: any) => {
          setFieldError(fieldId, error);
          emit(fieldId);
        },
        setFieldTouched: (fieldId: string, value?: boolean) => {
          touch(fieldId, value == null ? true : value);
          emit(fieldId);
        },
        setFieldValue: change,
        submit,
        touched: touched as Touched,
        validate: validateForm,
        values,
      }}
    >
      {noForm ? (
        toRender
      ) : (
        <form onSubmit={submit} {...formProps}>
          {toRender}
        </form>
      )}
    </formContext.Provider>
  );
};

export default Form;

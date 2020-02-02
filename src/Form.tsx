import * as React from 'react';
import { emit } from './context/emitter';
import { deriveInitial } from './helpers/deriveInitial';
import { deriveKeys } from './helpers/deriveKeys';
import useState, { EMPTY_OBJ } from './helpers/useState';
import { Errors, FormHookContext, Touched } from './types';

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

  const validateForm = () => {
    const validationErrors = (validate && validate(values)) || EMPTY_OBJ;
    setErrorState(validationErrors);
    emit(
      ([] as Array<string>).concat(
        deriveKeys(validationErrors),
        deriveKeys(errors)
      )
    );

    return validationErrors;
  };

  const resetForm = () => {
    isDirty.current = false;
    setValuesState(initialValues);
    setTouchedState(initialErrors && deriveInitial(initialErrors, true));
    setErrorState(initialErrors);
    emit(
      ([] as Array<string>).concat(
        deriveKeys(initialValues || EMPTY_OBJ),
        deriveKeys(values)
      )
    );
  };

  const handleSubmit = () => {
    const fieldErrors = validateForm();
    setTouchedState(deriveInitial(fieldErrors, true));
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

  React.useEffect(() => {
    if (enableReinitialize) resetForm();
  }, [initialValues]);

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
        },
        setFieldTouched: (fieldId: string, value?: boolean) => {
          touch(fieldId, value == null ? true : value);
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

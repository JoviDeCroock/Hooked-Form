import * as React from 'react';
import { createEmitter } from './context/emitter';
import { deriveInitial } from './helpers/deriveInitial';
import { deriveKeys } from './helpers/deriveKeys';
import { Errors, FormHookContext, Touched, ValidationTuple } from './types';
import { set, get } from './helpers/operations';

const EMPTY_OBJ = {};
export const formContext = React.createContext<FormHookContext>(
  EMPTY_OBJ as FormHookContext,
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
  onError?: (error: Error, callbag: ErrorBag) => void;
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
  const fieldValidators = React.useRef<ValidationTuple[]>([]);
  const isDirty = React.useRef(false);

  const { 0: values, 1: setValues } = React.useState<Partial<Values> | object>(
    initialValues || EMPTY_OBJ
  );

  const { 0: touched, 1: setTouched } = React.useState<
    Partial<Touched> | object
  >((initialErrors && (() => deriveInitial(initialErrors, true))) || EMPTY_OBJ);

  const { 0: errors, 1: setErrors } = React.useState<Partial<Errors> | object>(
    initialErrors || EMPTY_OBJ
  );

  const { 0: isSubmitting, 1: setSubmitting } = React.useState(false);
  const { 0: formError, 1: setFormError } = React.useState();

  const emitter = React.useMemo(createEmitter, []);

  const validateForm = () => {
    let validationErrors = (validate && validate(values)) || EMPTY_OBJ;

    fieldValidators.current.some(tuple => {
      validationErrors = set(
        validationErrors,
        tuple[0],
        tuple[1](get(values, tuple[0]))
      );
    });

    // When we have fieldValidation we should remove the properties that return undefiend
    if (fieldValidators.current.length)
      validationErrors = JSON.parse(JSON.stringify(validationErrors));

    if (
      // Eager bailout for the EMPTY_OBJ case.
      validationErrors !== errors &&
      JSON.stringify(errors) !== JSON.stringify(validationErrors)
    ) {
      setErrors(validationErrors as Errors);
      emitter.emit(
        ([] as Array<string>).concat(
          deriveKeys(validationErrors),
          deriveKeys(errors)
        )
      );
    }

    return validationErrors;
  };

  const resetForm = () => {
    isDirty.current = false;
    setValues(initialValues || EMPTY_OBJ);
    if (initialErrors) {
      setTouched(deriveInitial(initialErrors, true));
      setErrors(initialErrors);
    }

    emitter.emit(
      ([] as Array<string>).concat(
        deriveKeys(initialValues || EMPTY_OBJ),
        deriveKeys(values)
      )
    );
  };

  const handleSubmit = (e?: React.SyntheticEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    setSubmitting(true);
    emitter.emit('s');
    const fieldErrors = validateForm();
    setTouched(deriveInitial(fieldErrors, true));

    if (!shouldSubmitWhenInvalid && deriveKeys(fieldErrors).length > 0) {
      setSubmitting(false);
      return emitter.emit('s');
    }

    return new Promise(resolve =>
      resolve(
        onSubmit(values, {
          setErrors,
          setFormError: (err: string) => {
            setFormError(err);
            emitter.emit('f');
          },
        })
      )
    ).then(
      (result: any) => {
        setSubmitting(false);
        emitter.emit('s');
        if (onSuccess) onSuccess(result, { resetForm });
      },
      (e: Error) => {
        setSubmitting(false);
        emitter.emit('s');
        if (onError)
          onError(e, {
            setErrors,
            setFormError: (err: string) => {
              setFormError(err);
              emitter.emit('f');
            },
          });
      }
    );
  };

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
    setValues(state => set(state, fieldId, value));
    emitter.emit(fieldId);
  };

  const toRender =
    typeof children === 'function'
      ? children({
          change,
          formError,
          isDirty: isDirty.current,
          isSubmitting,
          handleSubmit,
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
        setFieldError: (fieldId: string, error?: string) => {
          setErrors(state => set(state as object, fieldId, error));
          emitter.emit(fieldId);
        },
        setFieldTouched: (fieldId: string, value: boolean) => {
          setTouched(state => set(state as object, fieldId, value));
          emitter.emit(fieldId);
        },
        setFieldValue: change,
        submit: handleSubmit,
        touched: touched as Touched,
        validate: validateForm,
        values,
        on: emitter.on,
        fieldValidators: fieldValidators.current,
      }}
    >
      {noForm ? (
        toRender
      ) : (
        <form onSubmit={handleSubmit} {...formProps}>
          {toRender}
        </form>
      )}
    </formContext.Provider>
  );
};

export default Form;

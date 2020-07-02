import * as React from 'react';
import { deriveInitial } from './helpers/deriveInitial';
import { deriveKeys } from './helpers/deriveKeys';
import {
  Errors,
  FormHookContext,
  Touched,
  ValidationTuple,
  PrivateFormHookContext,
} from './types';
import { set, get } from './helpers/operations';

const EMPTY_OBJ = {};
export const formContext = React.createContext<FormHookContext>(
  EMPTY_OBJ as FormHookContext
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

  const submittingState = React.useState(false);
  const formErrorState = React.useState<string | undefined>();

  const validateForm = () => {
    let validationErrors = (validate && validate(values)) || EMPTY_OBJ;

    fieldValidators.current.some(tuple => {
      const error = tuple[1](get(values, tuple[0]));
      if (error) {
        validationErrors = set(validationErrors, tuple[0], error);
      }
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
  };

  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event && event.preventDefault) event.preventDefault();
    submittingState[1](true);
    const fieldErrors = validateForm();
    setTouched(deriveInitial(fieldErrors, true));

    if (!shouldSubmitWhenInvalid && deriveKeys(fieldErrors).length > 0) {
      return submittingState[1](false);
    }

    return new Promise(resolve =>
      resolve(
        onSubmit(values, {
          setErrors: (submitErrors: Errors) => {
            setErrors(submitErrors);
          },
          setFormError: (err: string) => {
            formErrorState[1](err);
          },
        })
      )
    ).then(
      (result: any) => {
        submittingState[1](false);
        if (onSuccess) onSuccess(result, { resetForm });
      },
      (err: Error) => {
        submittingState[1](false);
        if (onError)
          onError(err, {
            setErrors: (submitErrors: Errors) => {
              setErrors(submitErrors);
            },
            setFormError: (err: string) => {
              formErrorState[1](err);
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
  };

  const toRender =
    typeof children === 'function'
      ? children({
          change,
          formError: formErrorState[0],
          isDirty: isDirty.current,
          isSubmitting: submittingState[0],
          handleSubmit,
          resetForm,
        })
      : children;

  return (
    <formContext.Provider
      value={
        {
          errors: errors as Errors,
          formError: formErrorState[0],
          isDirty: isDirty.current,
          isSubmitting: submittingState[0],
          resetForm,
          setFieldError: (fieldId: string, error?: string) => {
            setErrors(state => set(state as object, fieldId, error));
          },
          setFieldTouched: (fieldId: string, value: boolean) => {
            setTouched(state => set(state as object, fieldId, value));
          },
          setFieldValue: change,
          submit: handleSubmit,
          touched: touched as Touched,
          validate: validateForm,
          values,
          _fieldValidators: fieldValidators.current,
        } as PrivateFormHookContext
      }
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

import * as React from 'react';
import { createEmitter } from './context/emitter';
import { deriveInitial } from './helpers/deriveInitial';
import { deriveKeys } from './helpers/deriveKeys';
import {
  Errors,
  FormHookContext,
  Touched,
  ValidationTuple,
  ArrayHookContext,
} from './types';
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

const Form = <Values extends object>(options: FormOptions<Values>) => {
  const fieldValidators = React.useRef<ValidationTuple[]>([]);
  const isDirty = React.useRef(false);
  const emitter = React.useMemo(createEmitter, []);

  const { 0: values, 1: setValues } = React.useState<Partial<Values> | object>(
    options.initialValues || EMPTY_OBJ
  );

  const { 0: touched, 1: setTouched } = React.useState<
    Partial<Touched> | object
  >(
    (options.initialErrors &&
      (() => deriveInitial(options.initialErrors as Errors, true))) ||
      EMPTY_OBJ
  );

  const { 0: errors, 1: setErrors } = React.useState<Partial<Errors> | object>(
    options.initialErrors || EMPTY_OBJ
  );

  const t = React.useRef(touched);
  const e = React.useRef(errors);
  const v = React.useRef(values);

  const submittingState = React.useState(false);
  const formErrorState = React.useState<string | undefined>();

  const validateForm = () => {
    let validationErrors =
      (options.validate && options.validate(values)) || EMPTY_OBJ;

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
      setErrors((e.current = validationErrors as Errors));
      emitter._emit(
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
    setValues((v.current = options.initialValues || EMPTY_OBJ));
    if (options.initialErrors) {
      setTouched((t.current = deriveInitial(options.initialErrors, true)));
      setErrors((e.current = options.initialErrors));
    }

    emitter._emit(
      ([] as Array<string>).concat(
        deriveKeys(options.initialValues || EMPTY_OBJ),
        deriveKeys(values)
      )
    );
  };

  const handleSubmit = (event?: React.SyntheticEvent) => {
    if (event && event.preventDefault) event.preventDefault();
    submittingState[1](true);
    emitter._emit('s');
    const fieldErrors = validateForm();
    setTouched((t.current = deriveInitial(fieldErrors, true)));

    if (
      !options.shouldSubmitWhenInvalid &&
      deriveKeys(fieldErrors).length > 0
    ) {
      submittingState[1](false);
      return emitter._emit('s');
    }

    return new Promise(resolve =>
      resolve(
        options.onSubmit(values, {
          setErrors: (submitErrors: Errors) => {
            setErrors((e.current = submitErrors));
          },
          setFormError: (err: string) => {
            formErrorState[1](err);
            emitter._emit('f');
          },
        })
      )
    ).then(
      (result: any) => {
        submittingState[1](false);
        emitter._emit('s');
        if (options.onSuccess) options.onSuccess(result, { resetForm });
      },
      (err: Error) => {
        submittingState[1](false);
        emitter._emit('s');
        if (options.onError)
          options.onError(err, {
            setErrors: (submitErrors: Errors) => {
              setErrors((e.current = submitErrors));
            },
            setFormError: (err: string) => {
              formErrorState[1](err);
              emitter._emit('f');
            },
          });
      }
    );
  };

  React.useEffect(() => {
    if (options.enableReinitialize) resetForm();
  }, [options.initialValues]);

  React.useEffect(() => {
    if (
      (options.validateOnBlur === undefined ||
        options.validateOnChange ||
        options.validateOnBlur) &&
      isDirty.current
    ) {
      validateForm();
    }
  }, [
    options.validateOnBlur === undefined
      ? touched
      : options.validateOnBlur && touched,
    options.validateOnChange && values,
    isDirty.current,
  ]);

  const change = (fieldId: string, value: any) => {
    isDirty.current = true;
    setValues(state => (v.current = set(state, fieldId, value)));
    emitter._emit(fieldId);
  };

  const toRender =
    typeof options.children === 'function'
      ? options.children({
          change,
          formError: formErrorState[0],
          isDirty: isDirty.current,
          isSubmitting: submittingState[0],
          handleSubmit,
          resetForm,
        })
      : options.children;

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
            setErrors(
              state => (e.current = set(state as object, fieldId, error))
            );
            emitter._emit(fieldId);
          },
          setFieldTouched: (fieldId: string, value: boolean) => {
            setTouched(
              state => (t.current = set(state as object, fieldId, value))
            );
            emitter._emit(fieldId);
          },
          setFieldValue: change,
          submit: handleSubmit,
          touched: touched as Touched,
          validate: validateForm,
          values,
          _fieldValidators: fieldValidators.current,
          _on: emitter._on,
          _getTouched: () => t,
          _getErrors: () => e,
          _getValues: () => v,
        } as ArrayHookContext
      }
    >
      {options.noForm ? (
        toRender
      ) : (
        <form
          onSubmit={handleSubmit}
          className={options.className}
          onKeyDown={options.onKeyDown}
        >
          {toRender}
        </form>
      )}
    </formContext.Provider>
  );
};

export default Form;

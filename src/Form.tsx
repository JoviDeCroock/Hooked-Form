import * as React from 'react';
import { Provider } from './helpers/context';
import { deriveInitial } from './helpers/deriveInitial';
import useBoolean from './helpers/useBoolean';
import useState from './helpers/useState';
import { Errors, InitialValues, Touched } from './types';

interface FormOptions {
  initialValues: InitialValues;
  onError: (error: object) => void;
  onSuccess: (result?: any) => void;
  onSubmit: (values: object) => any;
  validate: (values: object, touched: object) => object
}

const OptionsContainer = ({ initialValues = {}, onSubmit, validate, onError, onSuccess }: FormOptions) => {
  const initialTouched = deriveInitial(initialValues, false);
  const initialErrors = deriveInitial(initialValues, null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, setSubmitting: (value: boolean) => void, values: object, errors: object) => {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      setSubmitting(true);
      const result = await onSubmit(values);
      setSubmitting(false);
      onSuccess(result);
    } catch (e) {
      setSubmitting(false);
      onerror(e);
    }
  }

  return React.memo((Component: any, ...props: Array<any>) => {
    const [values, setFieldValue, setValuesState] = useState(initialValues);
    const [touched, touch] = useState(initialTouched);
    const [formErrors, setErrors, setErrorState] = useState(initialErrors)
    const [setSubmitting, isSubmitting] = useBoolean(false);

    const validateForm = () => {
      const errors = validate(values, touched);
      setErrorState({ ...errors });
    }

    const setFieldTouched = (fieldId: string) => {
      touch(fieldId, true);
      validateForm();
    }

    const resetForm = () => {
      setValuesState(initialValues);
    }

    return (
      <Provider value={{
        errors: formErrors as Errors,
        initialValues,
        setFieldTouched,
        setFieldValue,
        touched: touched as Touched,
        values,
      }}>
        <Component
          handleSubmit={handleSubmit.bind(null, setSubmitting, values, formErrors)}
          validate={validateForm}
          isSubmitting={isSubmitting}
          resetForm={resetForm}
          {...props}
        />
      </Provider>
    )
  });
}

export default OptionsContainer;

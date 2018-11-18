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
  shouldSubmitWhenInvalid: boolean;
  validate: (values: object, touched: object) => object
  validateOnBlur: boolean;
  validateOnChange: boolean;
}

const OptionsContainer = ({
  initialValues = {},
  onSubmit,
  validate,
  onError,
  onSuccess,
  shouldSubmitWhenInvalid = false,
  validateOnBlur,
  validateOnChange,
}: FormOptions) => {
  const initialTouched = deriveInitial(initialValues, false);
  const initialErrors = deriveInitial(initialValues, null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    setSubmitting: (value: boolean) => void,
    validateForm: () => object,
    values: object,
    touched: object
  ) => {
    try {
      if (event) {
        event.preventDefault();
      }
      const errors = validateForm();
      if (!shouldSubmitWhenInvalid && Object.keys(errors).length > 0) { return; }
      setSubmitting(true);
      const result = await onSubmit(values);
      setSubmitting(false);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      setSubmitting(false);
      if (onError) {
        onerror(e);
      }
    }
  }

  return (Component: any) => React.memo((props: object) => {
    const [values, setFieldValue, setValuesState] = useState(initialValues);
    const [touched, touch] = useState(initialTouched);
    const [formErrors, setErrors, setErrorState] = useState(initialErrors)
    const [setSubmitting, isSubmitting] = useBoolean(false);

    // Provide a way to reset the full form to the initialValues.
    const resetForm = React.useCallback(() => setValuesState(initialValues), []);

    // The validation step in our form, this memoization happens on values and touched.
    const validateForm = () => {
      let result = {};
      if (validate) {
        const validationErrors = validate(values, touched);
        setErrorState({ ...validationErrors });
        result = validationErrors;
      }
      return result;
    };

    // Make our sideEffect when we have to validate onBlurring the field.
    if (validateOnBlur) {
      React.useEffect(() => { validateForm(); }, [touched])
    }

    // Make our sideEffect when we have to validate onChanging the field.
    if (validateOnChange) {
      React.useEffect(() => { validateForm(); }, [values])
    }

    // The submit for our form.
    const handleSubmitProp = React.useCallback((event) => handleSubmit(event, setSubmitting, validateForm, values, touched), [values, touched]);

    // The onBlur we can use for our Fields, should also be renewed context wise when our values are altered.
    const setFieldTouched = React.useCallback((fieldId: string) => {
      touch(fieldId, true);
    }, [values, touched]);

    // The onChange we can use for our Fields, should also be renewed context wise when our touched are altered.
    const onChangeProp = React.useCallback((fieldId: string, value: any) => {
      setFieldValue(fieldId, value);
    }, [values, touched]);

    return (
      <Provider value={{
        errors: formErrors as Errors,
        initialValues,
        setFieldTouched,
        setFieldValue: onChangeProp,
        touched: touched as Touched,
        values,
      }}>
        <Component
          handleSubmit={handleSubmitProp}
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

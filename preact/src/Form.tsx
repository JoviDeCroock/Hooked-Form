import { useEffect, useState as nativeUseState, useCallback } from 'preact/hooks';
import { createElement } from 'preact';
import { Provider } from './helpers/context';
import { deriveInitial } from './helpers/deriveInitial';
import useState from './helpers/useState';
import { Errors, InitialValues, Touched } from './types';

export interface FormOptions {
  enableReinitialize?: boolean;
  initialValues?: InitialValues;
  mapPropsToValues?: (props: object) => InitialValues;
  onError?: (error: object, setFormError: (error: any) => void) => void;
  onSuccess?: (result?: any) => void;
  onSubmit?: (values: object, props: object) => Promise<any> | any;
  shouldSubmitWhenInvalid?: boolean;
  validate?: (values: object) => object;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

const OptionsContainer = ({
  enableReinitialize,
  initialValues: formInitialValues,
  mapPropsToValues,
  onSubmit,
  validate,
  onError,
  onSuccess,
  shouldSubmitWhenInvalid,
  validateOnBlur,
  validateOnChange,
}: FormOptions) => {
  let initialValues = formInitialValues || {};
  let initialTouched = deriveInitial(initialValues, false);
  let initialErrors = deriveInitial(initialValues, null);
  let hasInitialized = false;
  let isDirty = false;

  return (Component: any) => function FormWrapper(props: { [property: string]: any }) {
    if (mapPropsToValues && !hasInitialized) {
      initialValues = mapPropsToValues(props);
      initialTouched = deriveInitial(initialValues, false);
      initialErrors = deriveInitial(initialValues, null);
      hasInitialized = true;
    }

    const { 0: values, 1: setFieldValue, 2: setValuesState } = useState(initialValues);
    const { 0: touched, 1:touch, 2: setTouchedState } = useState(initialTouched);
    const { 0: formErrors, 2: setErrorState } = useState(initialErrors);
    const { 0: isSubmitting, 1: setSubmitting } = nativeUseState(false);
    const { 0: formError, 1: setFormError } = nativeUseState(null);

    // The validation step in our form, this memoization happens on values and touched.
    const validateForm = useCallback(() => {
      if (validate) {
        const validationErrors = validate(values);
        setErrorState(validationErrors);
        return validationErrors || {};
      }
      return {};
    }, [values]);

    // Provide a way to reset the full form to the initialValues.
    const resetForm = useCallback(() => {
      isDirty = false;
      initialValues = mapPropsToValues ? mapPropsToValues(props) : initialValues;
      setValuesState(initialValues);
      setTouchedState(deriveInitial(initialValues, false));
      setErrorState(deriveInitial(initialValues, null));
    }, [props, mapPropsToValues, initialValues]);

    const handleSubmit = useCallback(async (event?: any) => {
      if (event && event.preventDefault) event.preventDefault();

      const submit = onSubmit || props.onSubmit;
      const errors = validateForm();

      setTouchedState(deriveInitial(errors, true));
      if (!shouldSubmitWhenInvalid && Object.keys(errors).length > 0) return;
      setSubmitting(() => true);

      new Promise(resolve => resolve(submit(values, props, setFormError)))
        .then((result: any) => {
          setSubmitting(() => false);
          if (onSuccess) onSuccess(result);
        })
        .catch((e: any) => {
          setSubmitting(() => false);
          if (onError) onError(e, setFormError);
        });
    }, [values]);

    // Make our listener for the reinitialization when need be.
    if (enableReinitialize) { useEffect(() => { resetForm(); }, [initialValues, props]); }

    // Run validations when needed.
    useEffect(() => {
      validateForm();
    }, [validateOnBlur && touched, validateOnChange && values]);

    // The submit for our form.
    const handleSubmitProp = useCallback((event?: any) =>
      handleSubmit(event), [handleSubmit]);

    // The onBlur we can use for our Fields,
    // should also be renewed context wise when our values are altered.
    const setFieldTouched = useCallback((fieldId: string, value?: boolean) => {
      touch(fieldId, value == undefined ? true : value); // tslint:disable-line
    }, []);

    // The onChange we can use for our Fields,
    // should also be renewed context wise when our touched are altered.
    const onChange = useCallback((fieldId: string, value: any) => {
      isDirty = true;
      setFieldValue(fieldId, value);
    }, []);

    return (
      <Provider
        value={{
          errors: formErrors as Errors,
          formError,
          initialValues,
          isDirty,
          setFieldTouched,
          setFieldValue: onChange,
          touched: touched as Touched,
          validate: validateForm,
          values,
        }}
      >
        <Component
          change={onChange}
          formError={formError}
          handleSubmit={handleSubmitProp}
          isSubmitting={isSubmitting}
          resetForm={resetForm}
          isDirty={isDirty}
          {...props}
        />
      </Provider>
    );
  };
};

export default OptionsContainer;

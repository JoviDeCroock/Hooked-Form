import * as React from 'react'
import { Provider } from './helpers/context'
import { deriveInitial } from './helpers/deriveInitial'
import useBoolean from './helpers/useBoolean'
import useState from './helpers/useState'
import { Errors, InitialValues, Touched } from './types'

interface FormOptions {
  enableReinitialize?: boolean
  initialValues?: InitialValues
  onError?: (error: object, setFormError: (error: any) => void) => void
  onSuccess?: (result?: any) => void
  onSubmit?: (values: object, props: object) => any
  shouldSubmitWhenInvalid?: boolean
  validate?: (values: object, touched: object) => object
  validateOnBlur?: boolean
  validateOnChange?: boolean
}

const OptionsContainer = ({
  enableReinitialize = false,
  initialValues = {},
  onSubmit,
  validate,
  onError,
  onSuccess,
  shouldSubmitWhenInvalid = false,
  validateOnBlur,
  validateOnChange,
}: FormOptions) => {
  const initialTouched = deriveInitial(initialValues, false)
  const initialErrors = deriveInitial(initialValues, null)

  return (Component: any) => (props: { [property: string]: any }) => {
    const { 0: values, 1: setFieldValue, 2: setValuesState } = useState(initialValues)
    const { 0: touched, 1:touch, 2: setTouchedState } = useState(initialTouched)
    const { 0: formErrors, 2: setErrorState } = useState(initialErrors)
    const { 0: setSubmitting, 1: isSubmitting } = useBoolean(false)
    const { 0: formError, 1: setFormError } = React.useState(null);

    // Provide a way to reset the full form to the initialValues.
    const resetForm = React.useCallback(() => {
      const newInitialTouched = deriveInitial(initialValues, false)
      const newInitialErrors = deriveInitial(initialValues, null)
      setValuesState(initialValues)
      setTouchedState(newInitialTouched)
      setErrorState(newInitialErrors)
    }, [initialValues])

    // The validation step in our form, this memoization happens on values and touched.
    const validateForm = () => {
      let result = {}
      if (validate) {
        const validationErrors = validate(values, touched)
        setErrorState({ ...validationErrors })
        result = validationErrors
      }
      return result
    }

    const handleSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
      try {
        if (event) {
          event.preventDefault()
        }
        const submit = onSubmit || props.onSubmit;
        const allTouched = deriveInitial(initialValues, true);
        setTouchedState(allTouched);
        const errors = validateForm()
        if (!shouldSubmitWhenInvalid && Object.keys(errors).length > 0) { return }
        setSubmitting(true)
        const result = await submit(values, props)
        setSubmitting(false)
        if (onSuccess) {
          onSuccess(result)
        }
      } catch (e) {
        setSubmitting(false)
        if (onError) {
          onError(e, setFormError);
        }
      }
    }, [values, validateForm]);

    // Make our listener for the reinitialization when need be.
    if (enableReinitialize) { React.useEffect(() => resetForm(), [initialValues]) }
    // Make our sideEffect when we have to validate onBlurring the field.
    if (validateOnBlur) {React.useEffect(() => { validateForm() }, [touched]) }
    // Make our sideEffect when we have to validate onChanging the field.
    if (validateOnChange) { React.useEffect(() => { validateForm() }, [values]) }

    // The submit for our form.
    const handleSubmitProp = React.useCallback((event) => handleSubmit(event), [values])
    // The onBlur we can use for our Fields, should also be renewed context wise when our values are altered.
    const setFieldTouched = React.useCallback((fieldId: string) => { touch(fieldId, true) }, [values, touched])
    // The onChange we can use for our Fields, should also be renewed context wise when our touched are altered.
    const onChangeProp = React.useCallback((fieldId: string, value: any) => setFieldValue(fieldId, value), [values, touched])
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
          change={onChangeProp}
          formError={formError}
          errors={formErrors}
          handleSubmit={handleSubmitProp}
          validate={validateForm}
          isSubmitting={isSubmitting}
          resetForm={resetForm}
          values={values}
          {...props}
        />
      </Provider>
    )
  }
}

export default OptionsContainer

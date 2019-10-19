import * as React from 'react';
import Form, { FormOptions } from './Form';
import useFormConnect from './useFormConnect';

const OptionsContainer = <Values extends object>({
  enableReinitialize,
  initialValues: formInitialValues,
  mapPropsToValues,
  ...rest
}: FormOptions<Values>) => {
  let initialValues = formInitialValues;

  if (process.env.NODE_ENV !== 'production') {
    // tslint:disable-next-line: no-console
    console.warn('The Higher-order component has been deprecated. use <HookedForm> instead.');
  }

  return function FormOuterWrapper(Component: React.ComponentType<any> | React.FC<any>) {
    const NewComponent = (props: any) => {
      const form = useFormConnect();
      return (
        <Component
          change={form.setFieldValue}
          formError={form.formError}
          handleSubmit={form.submit}
          isSubmitting={form.isSubmitting}
          resetForm={form.resetForm}
          isDirty={form.isDirty}
          {...props}
        />
      );
    };

    return function FormWrapper(props: { [property: string]: any }) {
      const passDownProps = React.useMemo(() => (enableReinitialize ? Object.values(props) : []), [
        enableReinitialize && props,
      ]);

      if (mapPropsToValues && !initialValues) initialValues = mapPropsToValues(props);

      // Make our listener for the reinitialization when need be.
      React.useEffect(() => {
        if (enableReinitialize && mapPropsToValues) initialValues = mapPropsToValues(props);
      }, [...passDownProps]);

      return (
        <Form<Values>
          {...rest}
          enableReinitialize={enableReinitialize}
          initialValues={initialValues}
          noForm={true}
        >
          <NewComponent {...props} />
        </Form>
      );
    };
  };
};

export default OptionsContainer;

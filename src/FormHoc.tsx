import * as React from 'react';
import { on } from './context/emitter';
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
      const ctx = useFormConnect(true);
      const state = React.useReducer(c => !c, false);
      on(['formError', 'isSubmitting', 'isDirty'], () => {
        // @ts-ignore
        state[1]();
      });
      return (
        <Component
          change={ctx.setFieldValue}
          formError={ctx.formError}
          handleSubmit={ctx.submit}
          isSubmitting={ctx.isSubmitting}
          resetForm={ctx.resetForm}
          isDirty={ctx.isDirty}
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

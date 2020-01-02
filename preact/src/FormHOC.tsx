import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { HookedForm, FormOptions } from './Form';
import { InitialValues } from './types';
import {useFormConnect} from './useFormConnect';

type FormHocOptions<T> = FormOptions<T> & {
  mapPropsToValues?: (props: object) => InitialValues;
};

export const Form = <Values extends object>({
  enableReinitialize,
  mapPropsToValues,
  ...rest
}: FormHocOptions<Values>) => {
  let isMounted = false;

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'The Higher-order component has been deprecated. use <HookedForm> instead.'
    );
  }

  return function FormOuterWrapper(
    Component: React.ComponentType<any> | React.FC<any>
  ) {
    const NewComponent = (props: any) => {
      const ctx = useFormConnect();
      return (
        // @ts-ignore
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
      const { 0: initialValues, 1: setInitialValues } = useState(() =>
        mapPropsToValues ? mapPropsToValues(props) : rest.initialValues
      );

      // Make our listener for the reinitialization when need be.
      useEffect(
        () => {
          if (enableReinitialize && mapPropsToValues && isMounted)
            setInitialValues(mapPropsToValues(props));
          isMounted = true;
        },
        enableReinitialize ? Object.values(props) : []
      );

      return (
        <HookedForm<Values>
          {...rest}
          enableReinitialize={enableReinitialize}
          initialValues={initialValues}
          noForm={true}
          validateOnBlur={
            /* istanbul ignore next */
            rest.validateOnBlur === undefined ? false : rest.validateOnBlur
          }
        >
          <NewComponent {...props} />
        </HookedForm>
      );
    };
  };
};

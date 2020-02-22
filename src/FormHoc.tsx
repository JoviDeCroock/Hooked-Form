import * as React from 'react';
import Form, { FormOptions } from './Form';

type FormHocOptions<Values, Props> = FormOptions<Values> & {
  mapPropsToValues?: (props: Props) => Partial<Values>;
};

const OptionsContainer = <Values extends object, Props extends object>({
  enableReinitialize,
  mapPropsToValues,
  ...rest
}: FormHocOptions<Values, Props>) => {
  let isMounted = false;

  return function FormOuterWrapper(
    Component: React.ComponentType<any> | React.FC<any>
  ) {
    return function FormWrapper(props: Props) {
      const { 0: initialValues, 1: setInitialValues } = React.useState(() =>
        mapPropsToValues ? mapPropsToValues(props) : rest.initialValues
      );

      React.useEffect(
        () => {
          if (enableReinitialize && mapPropsToValues && isMounted)
            setInitialValues(mapPropsToValues(props));
          isMounted = true;
        },
        enableReinitialize ? Object.values(props) : []
      );

      return (
        <Form<Values>
          {...rest}
          enableReinitialize={enableReinitialize}
          initialValues={initialValues}
          noForm={true}
          validateOnBlur={
            /* istanbul ignore next */
            rest.validateOnBlur === undefined ? false : rest.validateOnBlur
          }
        >
          {form => <Component {...form} {...props} />}
        </Form>
      );
    };
  };
};

export default OptionsContainer;

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
    Component: React.ComponentType<Props> | React.FC<Props>
  ) {
    return function FormWrapper(props: Props) {
      const initialValuesState = React.useState(() =>
        mapPropsToValues ? mapPropsToValues(props) : rest.initialValues
      );

      React.useEffect(
        () => {
          if (enableReinitialize && mapPropsToValues && isMounted)
            initialValuesState[1](mapPropsToValues(props));
          isMounted = true;
        },
        enableReinitialize ? Object.values(props) : []
      );

      return (
        <Form<Values>
          {...rest}
          enableReinitialize={enableReinitialize}
          initialValues={initialValuesState[0]}
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

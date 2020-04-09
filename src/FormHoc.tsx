import * as React from 'react';
import Form, { FormOptions } from './Form';

type FormHocOptions<Values, Props> = FormOptions<Values> & {
  mapPropsToValues?: (props: Props) => Partial<Values>;
};

const OptionsContainer = <Values extends object, Props extends object>(
  options: FormHocOptions<Values, Props>
) => {
  let isMounted = false;

  return function FormOuterWrapper(
    Component: React.ComponentType<Props> | React.FC<Props>
  ) {
    return function FormWrapper(props: Props) {
      const initialValuesState = React.useState(
        () => options.mapPropsToValues && options.mapPropsToValues(props)
      );

      React.useEffect(
        () => {
          if (
            options.enableReinitialize &&
            options.mapPropsToValues &&
            isMounted
          )
            initialValuesState[1](options.mapPropsToValues(props));
          isMounted = true;
        },
        options.enableReinitialize ? Object.values(props) : []
      );

      return (
        <Form<Values>
          {...options}
          initialValues={initialValuesState[0] || options.initialValues}
          noForm={true}
          validateOnBlur={
            /* istanbul ignore next */
            options.validateOnBlur === undefined
              ? false
              : options.validateOnBlur
          }
        >
          {form => <Component {...form} {...props} />}
        </Form>
      );
    };
  };
};

export default OptionsContainer;

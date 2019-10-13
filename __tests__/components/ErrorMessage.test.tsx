import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { Form, useFormConnect } from '../../src';
import { ErrorMessage } from '../_utils';

const ErrorDisplay = ({ error }: { error: string }) => {
  return <p data-testid="error">{error}</p>;
}

const Component = () => (
  <ErrorMessage fieldId="name" component={ErrorDisplay} />
);

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = () => {
    injectedProps = useFormConnect();
    return <Component />
  }
  return {
    getProps: () => injectedProps,
    ...render(<Form onSubmit={() => null} {...formOptions}><TestForm {...props} /></Form>),
  };
};

describe('ErorrMessage', () => {
  afterEach(() => {
    cleanup();
  });

  describe('functionality', () => {
    it('should render the correct error', () => {
      const { getProps, getByTestId } =
        makeForm({ validate: () => ({ name: 'bad' }), validateOnChange: true });
      const { setFieldValue } = getProps();
      act(() => {
        setFieldValue('name', 'jovi');
      });
      const errorPTag = getByTestId('error');
      expect(errorPTag.textContent).toEqual('bad');
    });

    it('should throw without a component', () => {
      // @ts-ignore
      const Error = () => <ErrorMessage fieldId="name" />;

      const makeErroneousForm = (formOptions?: object, props?: object) => {
        let injectedProps: any;
        const TestForm = () => {
          injectedProps = useFormConnect();
          return <Error />
        }
        return {
          getProps: () => injectedProps,
          ...render(<Form onSubmit={() => null} {...formOptions}><TestForm {...props} /></Form>),
        };
      };

      expect(() => makeErroneousForm()).toThrowError(/The ErrorMessage needs a "component" property to  function correctly/);
    });
  });
});

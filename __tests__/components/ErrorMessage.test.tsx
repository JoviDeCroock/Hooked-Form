import * as React from 'react';
import { act as nativeAct, cleanup, render } from 'react-testing-library';
const { createElement } = React;

import { ErrorMessage, Form } from '../../src';

let act = nativeAct;
if (!act) {
  const { act: preactAct } = require('preact/test-utils');
  act = preactAct
}

let renders = 0;
const ErrorDisplay = ({ error }: { error: string }) => {
  renders +=1;
  return <p data-testid="error">{error}</p>;
}
// @ts-ignore
const Component = () => <ErrorMessage fieldId="name" component={ErrorDisplay} />;

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = Form({
    onSubmit: () => null,
    ...formOptions,
  })((formProps: any) => (injectedProps = formProps) && <Component {...formProps} />);
  return {
    getProps: () => injectedProps,
    // @ts-ignore
    ...render(<TestForm {...props} />),
  };
};

describe('ErorrMessage', () => {
  afterEach(() => {
    renders = 0;
    cleanup();
  });

  describe('functionality', () => {
    it('should render the correct error', () => {
      const { getProps, getByTestId } =
        makeForm({ validate: () => ({ name: 'bad' }), validateOnChange: true });
      const { change } = getProps();
      act(() => {
        change('name', 'jovi');
      });
      const errorPTag = getByTestId('error');
      expect(errorPTag.textContent).toEqual('bad');
    });

    it('should throw without a component', () => {
      // @ts-ignore
      const Error = () => <ErrorMessage fieldId="name" />;

      const makeErroneousForm = (formOptions?: object, props?: object) => {
        let injectedProps: any;
        const TestForm = Form({
          onSubmit: () => null,
          ...formOptions,
        })((formProps: any) => (injectedProps = formProps) && <Error {...formProps} />);
        return {
          getProps: () => injectedProps,
          // @ts-ignore
          ...render(<TestForm {...props} />),
        };
      };

      expect(() => makeErroneousForm()).toThrowError(/The ErrorMessage needs a "component" property to  function correctly/);
    });
  });

  if (process.env.PERFORMANCE) describe.only('performance', () => {
    if (process.env.PERFORMANCE) test.only('should not rerender when props change or parent rerenders', () => {
      const { getProps, getByTestId, rerender, ...rest } =
        makeForm({ validate: (values: any = {}) => values.name === 'jovi' ? ({ name: 'bad' }) : ({}), validateOnChange: true });
      const { change } = getProps();
      expect(renders).toBe(1);
      act(() => {
        change('name', 'j');
      });
      expect(renders).toBe(1);
      act(() => {
        change('name', 'jovi');
      });
      expect(renders).toBe(2);
    })
  });
});

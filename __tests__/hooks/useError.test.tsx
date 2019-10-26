import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { HookedForm, useFormConnect, useError } from '../../src';

const ErrorDisplay = () => {
  const error = useError('name');
  return <p data-testid="error">{error}</p>;
}

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    injectedProps = useFormConnect();
    return <ErrorDisplay />
  }
  return {
    getProps: () => injectedProps,
    ...render(
      <HookedForm onSubmit={() => null} {...HookedFormOptions}>
        <TestHookedForm {...props} />
      </HookedForm>
    ),
  };
};

describe('useError', () => {
  afterEach(() => {
    cleanup();
  });

  describe('functionality', () => {
    it('should render the correct error', () => {
      const { getProps, getByTestId } =
        makeHookedForm({ validate: () => ({ name: 'bad' }), validateOnChange: true });

      const { setFieldValue, errors } = getProps();

      act(() => {
        setFieldValue('name', 'jovi');
      });

      const errorPTag = getByTestId('error');
      expect(errors.name).toEqual('bad');
      expect(errorPTag.textContent).toEqual('bad');
    });
  });
});

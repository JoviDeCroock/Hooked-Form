import * as React from 'react';
import { act as nativeAct, cleanup, render } from 'react-testing-library';

import { ErrorMessage, Form } from '../../src';

let act = nativeAct;
if (!act) {
  act = (React as any).act;
}

const ErrorDisplay = ({ error }: { error: string }) => <p data-testid="error">{error}</p>;
// @ts-ignore
const Component = () => (<ErrorMessage fieldId="name" component={ErrorDisplay} />);

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
  afterEach(() => cleanup());

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
});

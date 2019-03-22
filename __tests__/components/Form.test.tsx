import * as React from 'react';
import { act as nativeAct, cleanup, render, wait } from 'react-testing-library';

import { Form, useFormConnect } from '../../src';

let act = nativeAct;
if (!act) {
  const { act: preactAct } = require('preact/test-utils');
  act = preactAct;
}

const Component = () => (<p>Hi</p>);

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = Form({
    onSubmit: () => null,
    ...formOptions,
  })((formProps: any) => {
    const formContext = useFormConnect();
    injectedProps = { ...formProps, ...formContext };
    return (
      <Component {...formProps} />
    );
  });
  return {
    getProps: () => injectedProps,
    ...render(<TestForm {...props} />)
  }
}

describe('Form', () => {
  afterEach(() => cleanup());

  it('Renders with correct properties.', () => {
    const { getProps } = makeForm({ initialValues: { name: 'jovi', friends: [] } });
    const { change, handleSubmit, validate, isSubmitting, resetForm, values } = getProps();
    expect(typeof change).toEqual('function');
    expect(typeof handleSubmit).toEqual('function');
    expect(typeof validate).toEqual('function');
    expect(typeof isSubmitting).toEqual('boolean');
    expect(typeof resetForm).toEqual('function');
    expect(typeof values).toEqual('object');
    expect(isSubmitting).toEqual(false);
    expect(values.name).toEqual('jovi');
  });

  it('Passes props through to child.', () => {
    const { getProps } = makeForm({}, { passThroughProp: 'x' });
    const { change, handleSubmit, validate, isSubmitting, resetForm, passThroughProp } = getProps();
    expect(typeof change).toEqual('function');
    expect(typeof handleSubmit).toEqual('function');
    expect(typeof validate).toEqual('function');
    expect(typeof isSubmitting).toEqual('boolean');
    expect(typeof resetForm).toEqual('function');
    expect(isSubmitting).toEqual(false);
    expect(passThroughProp).toEqual('x');
  });

  it('should render child element', () => {
    const { container } = makeForm();
    expect(container.firstChild).toBeDefined();
  });

  it('Changes when calling change', () => {
    const { getProps } = makeForm();
    const { change } = getProps();
    act(() => { change('name', 'joviMutated') });
    const { values } = getProps();
    expect(values.name).toEqual('joviMutated');
  });

  it('should use mapPropsToValues correctly', () => {
    const { getProps } = makeForm({ mapPropsToValues: ({ name }: any) => ({ name, friends: [] }) }, { name: 'jovi' });
    const { values } = getProps();
    expect(values.name).toEqual('jovi');
    expect(values.friends.length).toEqual(0);
  });

  it('Resets correctly', () => {
    const { getProps } = makeForm({ initialValues: { name: 'jovi' }});
    const { change } = getProps();
    act(() => {
      change('name', 'joviMutated')
    });
    let { values, resetForm } = getProps();
    expect(values.name).toEqual('joviMutated');
    act(() => { resetForm() });
    ({ values, resetForm } = getProps());
    expect(values.name).toEqual('jovi');
  });

  it('calls validate onChange', () => {
    // TODO: act() of preact seems to not flush the initial effect triggered
    // to validate.
    const validate = jest.fn();
    const { getProps } = makeForm({ validate, validateOnChange: true });
    expect(getProps().isDirty).toBe(false);
    let { change } = getProps();
    act(() => {
      change('name', 'joviMutated')
    })
    expect(getProps().isDirty).toBe(true);
    expect(validate).toBeCalledTimes(2);

    ({ change } = getProps());
    act(() => {
      change('name', 'joviMutated')
    });
    expect(validate).toBeCalledTimes(3);
  });

  it('calls onSubmit when needed', async () => {
    const onSubmit = jest.fn();
    const onSuccess = jest.fn();
    const { getProps } = makeForm({ initialValues: { name: 'Jovi', age: 23 }, onSubmit, onSuccess });
    let { handleSubmit } = getProps();
    const { change } = getProps();
    act(() => {
      handleSubmit()
    });
    expect(onSubmit).toBeCalled();
    const { isSubmitting } = getProps();
    expect(isSubmitting).toBeTruthy();
    await wait(() => {
      expect(onSubmit).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSubmit.mock.calls[0][0].name).toBe('Jovi');
      expect(onSubmit.mock.calls[0][0].age).toBe(23);
    }, { timeout: 0 });
    act(() => { change('age', 22) });
    act(() => { change('name', 'Liesse') });
    await wait(async () => {
      ({ handleSubmit } = getProps());
      act(() => {
        handleSubmit()
      });
      await wait(() => {
        expect(onSubmit).toBeCalledTimes(2);
        expect(onSuccess).toBeCalledTimes(2);
        expect(onSubmit.mock.calls[1][0].name).toBe('Liesse');
        expect(onSubmit.mock.calls[1][0].age).toBe(22);
      }, { timeout: 0 })
    }, { timeout: 0 })
  });

  it('calls onError when needed', async () => {
    const onSubmit = () => { throw new Error('hi') };
    const onError = jest.fn();
    const { getProps } = makeForm({ onSubmit, onError });
    const { handleSubmit } = getProps();
    act(() => {
      handleSubmit()
    });
    await wait(() => {
      expect(onError).toBeCalledTimes(1);
    }, { timeout: 0 })
  });
});

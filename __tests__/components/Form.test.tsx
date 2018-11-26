import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { render, wait } from 'react-testing-library';
import { Form } from '../../src';

const Component = () => (<p>Hi</p>);

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = Form({
    onSubmit: () => null,
    ...formOptions,
  })((formProps: any) => (injectedProps = formProps) && <Component {...formProps} />);
  return {
    getProps: () => injectedProps,
    ...render(<TestForm {...props} />)
  }
}


describe('Form', () => {
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
    change('name', 'joviMutated');
    const { values } = getProps();
    expect(values.name).toEqual('joviMutated');
  });

  it('Resets correctly', () => {
    const { getProps } = makeForm({ initialValues: { name: 'jovi' }});
    const { change } = getProps();
    change('name', 'joviMutated');
    let { values, resetForm } = getProps();
    expect(values.name).toEqual('joviMutated');
    resetForm();
    ({ values, resetForm } = getProps());
    expect(values.name).toEqual('jovi');
  });

  it('calls validate onChange', () => {
    const validate = jest.fn();
    const { getProps } = makeForm({ validate, validateOnChange: true });
    let { change } = getProps();
    change('name', 'joviMutated');
    expect(validate).toBeCalledTimes(1);
    ({ change } = getProps());
    change('name', 'joviMutated');
    expect(validate).toBeCalledTimes(2);
  });

  it('calls onSubmit when needed', () => {
    const onSubmit = jest.fn();
    const onSuccess = jest.fn();
    const { getProps } = makeForm({ initialValues: { name: 'Jovi', age: 23 }, onSubmit, onSuccess });
    const { handleSubmit } = getProps();
    handleSubmit();
    expect(handleSubmit).toBeCalledWith({ name: 'Jovi', age: 23 });
    const { isSubmitting } = getProps();
    expect(isSubmitting).toBeTruthy();
    wait(() => {
      expect(onSubmit).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledTimes(1);
    }, { timeout: 100 })
  });

  it('calls onError when needed', () => {
    const onSubmit = () => { throw new Error('hi') };
    const onError = jest.fn();
    const { getProps } = makeForm({ onSubmit, onError });
    const { handleSubmit } = getProps();
    handleSubmit();
    wait(() => {
      expect(onSubmit).toBeCalledTimes(1);
      expect(onError).toBeCalledTimes(1);
    }, { timeout: 100 })
  });
});

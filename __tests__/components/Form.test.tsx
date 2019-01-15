import * as React from 'react';
import { cleanup, render, wait } from 'react-testing-library';
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

  it('calls onSubmit when needed', async () => {
    const onSubmit = jest.fn();
    const onSuccess = jest.fn();
    const { getProps } = makeForm({ initialValues: { name: 'Jovi', age: 23 }, onSubmit, onSuccess });
    let { handleSubmit } = getProps();
    const { change } = getProps();
    handleSubmit();
    expect(onSubmit).toBeCalled();
    const { isSubmitting } = getProps();
    expect(isSubmitting).toBeTruthy();
    await wait(() => {
      expect(onSubmit).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledTimes(1);
      expect(onSubmit.mock.calls[0][0].name).toBe('Jovi');
      expect(onSubmit.mock.calls[0][0].age).toBe(23);
    }, { timeout: 0 });
    change('age', 22)
    change('name', 'Liesse')
    await wait(async () => {
      ({ handleSubmit } = getProps());
      handleSubmit();
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
    handleSubmit();
    await wait(() => {
      expect(onError).toBeCalledTimes(1);
    }, { timeout: 0 })
  });
});

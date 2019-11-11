import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { Form, useFormConnect } from '../../src';

const Component = ({ onSubmit }: { onSubmit: any }) => (
  <form onSubmit={onSubmit}>
    <p>Hi</p>
  </form>
);

const makeHookedForm = (hookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = (props: any) => {
    injectedProps = useFormConnect();
    return <Component {...props} />
  }

  const HookedForm = Form({
    onSubmit: () => null,
    ...hookedFormOptions,
  })(TestHookedForm)
  return {
    getProps: () => injectedProps,
    ...render(<HookedForm {...props} />),
  };
}

describe('HookedForm', () => {
  afterEach(() => cleanup());

  it('useFormConnect passes correct properties.', () => {
    const { getProps } = makeHookedForm({ initialValues: { name: 'jovi', friends: [] } });
    const { setFieldValue, submit, validate, isSubmitting, resetForm, values } = getProps();

    expect(typeof setFieldValue).toEqual('function');
    expect(typeof submit).toEqual('function');
    expect(typeof validate).toEqual('function');
    expect(typeof isSubmitting).toEqual('boolean');
    expect(typeof resetForm).toEqual('function');
    expect(typeof values).toEqual('object');
    expect(isSubmitting).toEqual(false);
    expect(values.name).toEqual('jovi');
  });

  it('should render child element', () => {
    const { container } = makeHookedForm();
    expect(container.firstChild).toBeDefined();
  });

  it('should use mapPropsToValues correctly', () => {
    const { getProps } = makeHookedForm({ mapPropsToValues: ({ name }: any) => ({ name, friends: [] }) }, { name: 'jovi' });
    const { values } = getProps();
    expect(values.name).toEqual('jovi');
    expect(values.friends.length).toEqual(0);
  });

  it('Changes when calling change', () => {
    const { getProps } = makeHookedForm();
    const { setFieldValue } = getProps();

    act(() => { setFieldValue('name', 'joviMutated') });

    const { values } = getProps();
    expect(values.name).toEqual('joviMutated');
  });

  it('Resets correctly', () => {
    const { getProps } = makeHookedForm({ initialValues: { name: 'jovi' }});
    const { setFieldValue } = getProps();
    act(() => {
      setFieldValue('name', 'joviMutated')
    });

    let { values, resetForm } = getProps();
    expect(values.name).toEqual('joviMutated');
    act(() => { resetForm() });
    ({ values, resetForm } = getProps());
    expect(values.name).toEqual('jovi');
  });

  it('calls validate onChange', () => {
    const validate = jest.fn();
    const { getProps } = makeHookedForm({ validate, validateOnChange: true });
    expect(getProps().isDirty).toBe(false);
    let { setFieldValue } = getProps();
    act(() => {
      setFieldValue('name', 'joviMutated')
    })
    expect(getProps().isDirty).toBe(true);
    expect(validate).toBeCalledTimes(1);

    ({ setFieldValue } = getProps());
    act(() => {
      setFieldValue('name', 'joviMutated')
    });
    expect(validate).toBeCalledTimes(2);
  });

  it('makes error and touches all fields onSubmit', () => {
    const onSubmit = jest.fn();
    const { getProps } = makeHookedForm({ onSubmit, validate: (values: any) => ({ name: !values.name ? 'required' : undefined }) });
    let { submit } = getProps();
    act(() => { submit() });
    const { errors, touched, isSubmitting } = getProps();
    expect(onSubmit).not.toBeCalled();
    expect(errors.name).toBe('required');
    expect(touched.name).toBeTruthy();
    expect(isSubmitting).toBe(false);
  });

  it('calls onSubmit when needed', async () => {
    const onSubmit = jest.fn();
    const onSuccess = jest.fn();
    const { getProps } = makeHookedForm({ initialValues: { name: 'Jovi', age: 23 }, onSubmit, onSuccess });
    let { submit } = getProps();
    const { setFieldValue } = getProps();
    await act(async () => {
      await submit();
      const { isSubmitting } = getProps();
      expect(isSubmitting).toBeTruthy();
    });
    expect(onSubmit).toBeCalled();
    expect(onSubmit).toBeCalledTimes(1);
    expect(onSuccess).toBeCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].name).toBe('Jovi');
    expect(onSubmit.mock.calls[0][0].age).toBe(23);
    act(() => { setFieldValue('age', 22) });
    act(() => { setFieldValue('name', 'Liesse') });
    ({ submit } = getProps());
    await act(async () => {
      await submit();
    });
    expect(onSubmit).toBeCalledTimes(2);
    expect(onSuccess).toBeCalledTimes(2);
    expect(onSubmit.mock.calls[1][0].name).toBe('Liesse');
    expect(onSubmit.mock.calls[1][0].age).toBe(22);
  });

  it('calls onError when needed', async () => {
    const onSubmit = () => { throw new Error('hi') };
    const onError = jest.fn();
    const { getProps } = makeHookedForm({ onSubmit, onError });
    const { submit } = getProps();

    await act(async () => {
      await submit();
    });

    expect(onError).toBeCalledTimes(1);
  });

  it('uses the ErrorBag methods correctly', async () => {
    // @ts-ignore
    const onSubmit = (_, { setErrors, setFormError }) => {
      setErrors({ name: 'hi' });
      setFormError('hi');
    };
    const { getProps } = makeHookedForm({ onSubmit });
    const { submit } = getProps();
    await act(async () => {
      await submit();
    });

    expect(getProps().formError).toBe('hi');
    expect(getProps().errors.name).toBe('hi');
  });
});

import * as React from 'react';
import { act, cleanup, render, wait } from '@testing-library/react';
import { Form, useFormConnect } from '../../src';

const Component = () => (<p>Hi</p>);

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
}

describe('Form', () => {
  afterEach(() => cleanup());

  it('useFormConnect passes correct properties.', () => {
    const { getProps } = makeForm({ initialValues: { name: 'jovi', friends: [] } });
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
    const { container } = makeForm();
    expect(container.firstChild).toBeDefined();
  });

  it('Changes when calling change', () => {
    const { getProps } = makeForm();
    const { setFieldValue } = getProps();
    act(() => { setFieldValue('name', 'joviMutated') });
    const { values } = getProps();
    expect(values.name).toEqual('joviMutated');
  });

  // it('should use mapPropsToValues correctly', () => {
  //   const { getProps } = makeForm({ mapPropsToValues: ({ name }: any) => ({ name, friends: [] }) }, { name: 'jovi' });
  //   const { values } = getProps();
  //   expect(values.name).toEqual('jovi');
  //   expect(values.friends.length).toEqual(0);
  // });

  it('Resets correctly', () => {
    const { getProps } = makeForm({ initialValues: { name: 'jovi' }});
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
    const { getProps } = makeForm({ validate, validateOnChange: true });
    expect(getProps().isDirty).toBe(false);
    let { setFieldValue } = getProps();
    act(() => {
      setFieldValue('name', 'joviMutated')
    })
    expect(getProps().isDirty).toBe(true);
    expect(validate).toBeCalledTimes(2);

    ({ setFieldValue } = getProps());
    act(() => {
      setFieldValue('name', 'joviMutated')
    });
    expect(validate).toBeCalledTimes(3);
  });

  it('makes error and touches all fields onSubmit', () => {
    const onSubmit = jest.fn();
    const { getProps } = makeForm({ onSubmit, validate: (values: any) => ({ name: !values.name ? 'required' : undefined }) });
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
    const { getProps } = makeForm({ initialValues: { name: 'Jovi', age: 23 }, onSubmit, onSuccess });
    let { submit } = getProps();
    const { setFieldValue } = getProps();
    act(() => {
      submit()
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
    act(() => { setFieldValue('age', 22) });
    act(() => { setFieldValue('name', 'Liesse') });
    await wait(async () => {
      ({ submit } = getProps());
      act(() => {
        submit()
      });
      await wait(async () => {
        expect(onSubmit).toBeCalledTimes(2);
        await wait(() => {
          expect(onSuccess).toBeCalledTimes(2);
          expect(onSubmit.mock.calls[1][0].name).toBe('Liesse');
          expect(onSubmit.mock.calls[1][0].age).toBe(22);
        }, { timeout: 0 });
      }, { timeout: 0 })
    }, { timeout: 0 })
  });

  it('calls onError when needed', async () => {
    const onSubmit = () => { throw new Error('hi') };
    const onError = jest.fn();
    const { getProps } = makeForm({ onSubmit, onError });
    const { submit } = getProps();
    act(() => {
      submit()
    });
    await wait(() => {
      expect(onError).toBeCalledTimes(1);
    }, { timeout: 0 })
  });

  it('uses the ErrorBag methods correctly', async () => {
    // @ts-ignore
    const onSubmit = (_, { setErrors, setFormError }) => {
      setErrors({ name: 'hi' });
      setFormError('hi');
    };
    const { getProps } = makeForm({ onSubmit });
    const { submit } = getProps();
    act(() => {
      submit()
    });
    await wait(() => {
      const { formError, errors } = getProps();
      expect(formError).toBe('hi');
      expect(errors.name).toBe('hi');
    }, { timeout: 0 })
  });
});

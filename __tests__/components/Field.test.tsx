
import * as React from 'react';
import { act, cleanup, fireEvent, render, wait } from 'react-testing-library';

import { Field, Form } from '../../src';

const StringField = (
  { touched, error, onChange, onBlur, value, id, reset }:
  { reset: () => void, touched: boolean, id: string, error?: string, onChange: (value: any) => void, onBlur: () => void, value: any }) => (
  <React.Fragment>
    <input
      data-testid={id}
      onBlur={onBlur}
      onChange={(e: any) => onChange(e.target.value)}
      value={value}
    />
    <p data-testid={`${id}-error`}>{error}</p>
    <p data-testid={`${id}-touched`}>{touched ? 'touched' : 'untouched'}</p>
    <button data-testid={`${id}-reset`} onClick={reset}>Reset</button>
  </React.Fragment>
)

const Component = ({ fieldId }: { fieldId: string }) => (<Field fieldId={fieldId} component={StringField} id={fieldId} />);

const makeForm = (formOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestForm = Form({
    onSubmit: () => null,
    ...formOptions,
  })((formProps: any) => (injectedProps = formProps) && (
    <React.Fragment>
      <Component fieldId="name" />
      <Component fieldId="age" />
    </React.Fragment>
  ));
  return {
    getProps: () => injectedProps,
    ...render(<TestForm {...props} />)
  }
}

describe('Field', () => {
  afterEach(() => cleanup());

  it('should render the stringfields', async () => {
    const { getProps, getByTestId } = makeForm({
      validate: (values: { [fieldId: string]: any }) => {
        return {
          age: values.age && values.age > 2 ? undefined : 'bad',
          name: values.name && values.name.length > 2 ? undefined : 'bad',
        }
      },
      validateOnBlur: true,
      validateOnChange: true,
    });

    const nameField = getByTestId('name');
    act(() => {
      fireEvent.change(nameField, {target: {value: 'upper'}})
    });
    expect((nameField as any).value).toEqual('upper');
    act(() => {
      fireEvent.change(nameField, {target: {value: 'u'}})
    });
    expect((nameField as any).value).toEqual('u');
    await wait(() => {
      const nameErrorField = getByTestId('name-error');
      expect(nameErrorField.textContent).toEqual('bad');
      act(() => {
        fireEvent.change(nameField, {target: {value: 'upper'}})
      });
    }, { timeout: 0 });
    await wait (() => {
      const nameErrorField = getByTestId('name-error');
      expect(nameErrorField.textContent).toEqual('');
    }, { timeout: 0 });
  });

  it('should reset the value', async () => {
    const { getProps, getByTestId } = makeForm({
      validate: (values: { [fieldId: string]: any }) => {
        return {
          age: values.age && values.age > 2 ? undefined : 'bad',
          name: values.name && values.name.length > 2 ? undefined : 'bad',
        }
      },
      validateOnBlur: true,
      validateOnChange: true,
    });
    let touchedField = getByTestId('name-touched');
    const nameField = getByTestId('name');
    act(() => {
      fireEvent.change(nameField, {target: {value: 'upper'}})
      fireEvent.blur(nameField)
    });
    expect((touchedField as any).textContent).toEqual('touched');
    expect((nameField as any).value).toEqual('upper');
    const resetButton = getByTestId('name-reset');
    act(() => {
      fireEvent.click(resetButton)
    });
    touchedField = getByTestId('name-touched');
    expect((touchedField as any).textContent).toEqual('untouched');
    expect((nameField as any).value).toEqual('');
  });

  it('should validate on blurring the stringfields', () => {
    const { getProps, getByTestId } = makeForm({
      validate: (values: { [fieldId: string]: any }) => {
        return {
          age: values.age && values.age > 2 ? undefined : 'bad',
          name: values.name && values.name.length > 2 ? undefined : 'bad',
        }
      },
      validateOnBlur: true,
      validateOnChange: false,
    });
    const nameField = getByTestId('name');
    const nameErrorField = getByTestId('name-error');
    act(() => {
      fireEvent.change(nameField, {target: {value: 'upper'}})
    });
    expect((nameField as any).value).toEqual('upper');
    act(() => {
      fireEvent.change(nameField, {target: {value: 'u'}})
    });
    expect((nameField as any).value).toEqual('u');
    act(() => {
      fireEvent.blur(nameField)
    });
    expect(nameErrorField.textContent).toEqual('bad');
  });
});

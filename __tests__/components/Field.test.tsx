
import * as React from 'react';
import { act as nativeAct, cleanup, fireEvent, render, wait } from 'react-testing-library';

import { Field, Form } from '../../src';

let act = nativeAct;
if (!act) {
  const { act: preactAct } = require('preact/test-utils');
  act = preactAct;
}

const StringField = (
  { touched, error, onChange, onBlur, value, id }:
  { touched: boolean, id: string, error?: string, onChange: (value: any) => void, onBlur: () => void, value: any }) => (
  <React.Fragment>
    <input
      data-testid={id}
      onBlur={onBlur}
      onChange={(e: any) => onChange(e.target.value)}
      value={value}
    />
    <p data-testid={`${id}-error`}>{error}</p>
    <p data-testid={`${id}-touched`}>{touched ? 'touched' : 'untouched'}</p>
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

  it('should render the stringfields', () => {
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
    let nameErrorField = getByTestId('name-error');
    expect(nameErrorField.textContent).toEqual('bad');
    act(() => {
      fireEvent.change(nameField, {target: {value: 'upper'}})
    });
    nameErrorField = getByTestId('name-error');
    expect(nameErrorField.textContent).toEqual('');
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

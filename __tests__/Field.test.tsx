
import * as React from 'react';
import { fireEvent, render, wait } from 'react-testing-library';
import { Field, Form } from '../src';

const StringField = ({ error, onChange, onBlur, value, id }: { id: string, error?: string, onChange: (value: any) => void, onBlur: () => void, value: any }) => (
  <React.Fragment>
    <input
      data-testid={id}
      onBlur={onBlur}
      onChange={(e: any) => onChange(e.target.value)}
      value={value}
    />
    <p data-testid={`${id}-error`}>{error}</p>
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
    fireEvent.change(nameField, {target: {value: 'upper'}});
    expect((nameField as any).value).toEqual('upper');
    fireEvent.change(nameField, {target: {value: 'u'}});
    expect((nameField as any).value).toEqual('u');
    wait(() => {
      const nameErrorField = getByTestId('name-error');
      expect(nameErrorField.textContent).toEqual('bad');
      fireEvent.change(nameField, {target: {value: 'upper'}});
      expect(nameErrorField.textContent).toEqual(null);
    }, { timeout: 250 });
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
    fireEvent.change(nameField, {target: {value: 'upper'}});
    expect((nameField as any).value).toEqual('upper');
    fireEvent.change(nameField, {target: {value: 'u'}});
    expect((nameField as any).value).toEqual('u');
    fireEvent.blur(nameField);
    expect(nameErrorField.textContent).toEqual('bad');
  });
});


import * as React from 'react';
import { act, cleanup, fireEvent, render } from 'react-testing-library';

import { Field, Form } from '../../src';

const StringField = (
  { touched, error, onChange, onBlur, value, id, onFocus }:
  { touched: boolean, id: string, error?: string, onChange: (value: any) => void, onBlur: () => void, value: any, onFocus: () => void }) => (
  <React.Fragment>
    <input
      data-testid={id}
      onBlur={onBlur}
      onChange={(e: any) => onChange(e.target.value)}
      onFocus={onFocus}
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

  describe('basic functionality', () => {
    it('should render the stringfields', () => {
      const { getByTestId } = makeForm({
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
      const { getByTestId } = makeForm({
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
      act(() => {
        fireEvent.focus(nameField)
      });
      const touched = getByTestId('name-touched');
      expect(touched.innerHTML).toBe('untouched');
    });

    it('should throw without a component/render', () => {
      // @ts-ignore
      const Comp = ({ fieldId }: { fieldId: string }) => (<Field fieldId={fieldId} id={fieldId} />);

      const makeErroneousForm = (formOptions?: object, props?: object) => {
        let injectedProps: any;
        const TestForm = Form({
          onSubmit: () => null,
          ...formOptions,
        })((formProps: any) => (injectedProps = formProps) && (
          <React.Fragment>
            <Comp fieldId="name" />
          </React.Fragment>
        ));
        return {
          getProps: () => injectedProps,
          ...render(<TestForm {...props} />)
        }
      }
      expect(() => makeErroneousForm()).toThrowError(/The Field needs a "component" property to  function correctly./);
    })
  });
});

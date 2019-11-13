
import * as React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { HookedForm, useFormConnect, useField, useSpy } from '../../src';

const StringField = ({ fieldId }: { fieldId: string }) => {
  const [{ onBlur, onChange, onFocus }, { value }] = useField(fieldId)
  return (
    <React.Fragment>
      <input
        data-testid={fieldId}
        onBlur={onBlur}
        onChange={(e: any) => onChange(e.target.value)}
        onFocus={onFocus}
        value={value}
      />
    </React.Fragment>
  )
}

const Check = ({ spy }: { spy: any }) => {
  useSpy('age', (newValue, ctx) => {
    spy(newValue);
  });
  return <p>Checker</p>
}

const makeHookedForm = (HookedFormOptions: object, spy: any) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    injectedProps = useFormConnect();
    return (
      <React.Fragment>
        <StringField fieldId="age" />
        <Check spy={spy} />
      </React.Fragment>
    )
  }

  return {
    getProps: () => injectedProps,
    ...render(
      <HookedForm onSubmit={() => null} {...HookedFormOptions}>
        <TestHookedForm />
      </HookedForm>
    ),
  };
};

const validate = (values: { [fieldId: string]: any }) => {
  return {
    age: values.age && values.age > 2 ? undefined : 'bad',
    name: values.name && values.name.length > 2 ? undefined : 'bad',
  }
}

describe('useSpy', () => {
  afterEach(() => cleanup());

  describe('basic functionality', () => {
    it('should listen for changes on a field', () => {
      const spy = jest.fn();
      const { getByTestId } = makeHookedForm({
        validate,
        validateOnBlur: true,
        validateOnChange: true,
      }, spy);

      const ageField = getByTestId('age');
      act(() => {
        fireEvent.change(ageField, {target: {value: 9}})
      });

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith("9")

      act(() => {
        fireEvent.change(ageField, {target: {value: 9}})
      });
      expect(spy).toBeCalledTimes(1);
    });
  });
});

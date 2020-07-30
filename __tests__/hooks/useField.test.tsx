import * as React from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { HookedForm, useFormConnect, useField } from '../../src';

const StringField = ({
  fieldId,
  val,
}: {
  fieldId: string;
  val?: (value: any) => string | undefined;
}) => {
  const [{ onBlur, onChange, onFocus }, { value, touched, error }] = useField(
    fieldId,
    val as any
  );
  return (
    <React.Fragment>
      <input
        data-testid={fieldId}
        onBlur={onBlur}
        onChange={(e: any) => onChange(e.target.value)}
        onFocus={onFocus}
        value={value}
      />
      <p data-testid={`${fieldId}-error`}>{error}</p>
      <p data-testid={`${fieldId}-touched`}>
        {touched ? 'touched' : 'untouched'}
      </p>
    </React.Fragment>
  );
};

const makeHookedForm = (HookedFormOptions?: object, props?: object) => {
  let injectedProps: any;
  const TestHookedForm = () => {
    injectedProps = useFormConnect();
    return (
      <React.Fragment>
        <StringField
          fieldId="name"
          val={props && (props as any).nameValidate}
        />
        <StringField fieldId="age" />
      </React.Fragment>
    );
  };

  return {
    getProps: () => injectedProps,
    ...render(
      <HookedForm onSubmit={() => null} {...HookedFormOptions}>
        <TestHookedForm {...props} />
      </HookedForm>
    ),
  };
};

const validate = (values: { [fieldId: string]: any }) => {
  return {
    age: values.age && values.age > 2 ? undefined : 'bad',
    name: values.name && values.name.length > 2 ? undefined : 'bad',
  };
};

describe('useField', () => {
  afterEach(() => cleanup());

  describe('basic functionality', () => {
    it('should render the stringfields and listen for changes', () => {
      const { getByTestId } = makeHookedForm({
        validate,
        validateOnBlur: true,
        validateOnChange: true,
      });

      const nameField = getByTestId('name');
      act(() => {
        fireEvent.change(nameField, { target: { value: 'upper' } });
      });

      expect((nameField as any).value).toEqual('upper');

      act(() => {
        fireEvent.change(nameField, { target: { value: 'u' } });
      });

      expect((nameField as any).value).toEqual('u');

      const nameErrorField = getByTestId('name-error');
      expect(nameErrorField.textContent).toEqual('bad');

      act(() => {
        fireEvent.change(nameField, { target: { value: 'upper' } });
      });

      expect(nameErrorField.textContent).toEqual('');
    });

    it('should validate on blurring the stringfields', () => {
      const { getByTestId } = makeHookedForm({
        validate,
        validateOnBlur: true,
        validateOnChange: false,
      });

      const nameField = getByTestId('name');
      const nameErrorField = getByTestId('name-error');
      act(() => {
        fireEvent.change(nameField, { target: { value: 'upper' } });
      });

      expect((nameField as any).value).toEqual('upper');

      act(() => {
        fireEvent.change(nameField, { target: { value: 'u' } });
      });

      expect((nameField as any).value).toEqual('u');

      act(() => {
        fireEvent.blur(nameField);
      });

      expect(nameErrorField.textContent).toEqual('bad');

      act(() => {
        fireEvent.focus(nameField);
      });

      const touched = getByTestId('name-touched');
      expect(touched.innerHTML).toBe('untouched');
    });

    it('should support field validation', () => {
      const { getByTestId } = makeHookedForm(
        {
          validateOnBlur: true,
          validateOnChange: false,
        },
        {
          // @ts-ignore
          nameValidate: (val: any) => (val === 'upper' ? 'bad' : undefined),
        }
      );

      const nameField = getByTestId('name');
      const nameErrorField = getByTestId('name-error');
      act(() => {
        fireEvent.change(nameField, { target: { value: 'upper' } });
      });

      expect((nameField as any).value).toEqual('upper');

      act(() => {
        fireEvent.blur(nameField);
      });

      expect(nameErrorField.textContent).toEqual('bad');

      act(() => {
        fireEvent.focus(nameField);
      });

      const touched = getByTestId('name-touched');
      expect(touched.innerHTML).toBe('untouched');

      act(() => {
        fireEvent.change(nameField, { target: { value: 'jovi' } });
      });

      act(() => {
        fireEvent.blur(nameField);
      });

      expect(nameErrorField.textContent).toEqual('');
    });

    it('should support changing the validation function', () => {
      type ValidateFn = (val: string | undefined) => string | undefined;
      const validate1: ValidateFn = (val: any) =>
        val === 'upper' ? 'bad' : undefined;
      const validate2: ValidateFn = (val: any) =>
        val === 'upper' ? undefined : 'bad';
      let setValidate:
        | React.Dispatch<React.SetStateAction<{ validate: ValidateFn }>>
        | undefined;

      function Form() {
        const [{ validate }, _setValidate] = React.useState({
          validate: validate1,
        });
        setValidate = _setValidate;

        return (
          <HookedForm onSubmit={() => null}>
            <StringField fieldId="name" val={validate} />
          </HookedForm>
        );
      }

      const { getByTestId } = render(<Form />);

      const nameField = getByTestId('name');
      const nameErrorField = getByTestId('name-error');
      act(() => {
        fireEvent.change(nameField, { target: { value: 'upper' } });
      });

      expect((nameField as any).value).toEqual('upper');
      expect(nameErrorField.textContent).toEqual('bad');

      act(() => {
        setValidate && setValidate({ validate: validate2 });
      });

      expect(nameErrorField.textContent).toEqual('');
    });

    it('should support removing the validation function', () => {
      type ValidateFn = (val: string | undefined) => string | undefined;
      const validate1: ValidateFn = (val: any) =>
        val === 'upper' ? 'bad' : undefined;

      let setValidate:
        | React.Dispatch<
            React.SetStateAction<{ validate: ValidateFn | undefined }>
          >
        | undefined;

      function Form() {
        const [{ validate }, _setValidate] = React.useState<{
          validate: ValidateFn | undefined;
        }>({
          validate: validate1,
        });
        setValidate = _setValidate;

        return (
          <HookedForm onSubmit={() => null}>
            <StringField fieldId="name" val={validate} />
          </HookedForm>
        );
      }

      const { getByTestId } = render(<Form />);

      const nameField = getByTestId('name');
      const nameErrorField = getByTestId('name-error');
      act(() => {
        fireEvent.change(nameField, { target: { value: 'upper' } });
      });

      expect((nameField as any).value).toEqual('upper');
      expect(nameErrorField.textContent).toEqual('bad');

      act(() => {
        setValidate && setValidate({ validate: undefined });
      });

      expect(nameErrorField.textContent).toEqual('');
    });
  });
});

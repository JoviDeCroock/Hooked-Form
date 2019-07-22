import * as React from 'react';
import { act, cleanup, render } from '@testing-library/react';

import { useError, useField, useFieldArray, Form } from '../../src';

const AppComponent = ({ children }: { children: any }) => {
  return children;
}

const App = Form({
  enableReinitialize: true,
  mapPropsToValues: (props: any) => ({ ...props.initialvalues }),
  validate: (values: any) => ({ name: values.name === 'Jovi' ? 'error' : undefined }),
  onSubmit: () => {}
})(AppComponent)

const Component = () => {
  // @ts-ignore
  const error = useError();
  return <p data-testid="error">{error}</p>
}

const Component2 = () => {
  // @ts-ignore
  const field = useField();
  return <p data-testid="error">{JSON.stringify(field)}</p>
}

const Component3 = () => {
  // @ts-ignore
  const array = useFieldArray();
  return <p data-testid="error">{JSON.stringify(array)}</p>
}

describe('hooks', () => {
  afterEach(() => {
    cleanup();
  });

  describe('useError', () => {
    it('should throw without fieldId', () => {
      expect(() => render(<App><Component /></App>)).toThrowError(/The Error needs a valid "fieldId" property to  function correctly./);
    });
  });

  describe('useFieldArray', () => {
    it('should throw without fieldId', () => {
      expect(() => render(<App><Component2 /></App>)).toThrowError(/The Field needs a valid "fieldId" property to  function correctly./);
    });
  });

  describe('useError', () => {
    it('should throw without fieldId', () => {
      expect(() => render(<App><Component3 /></App>)).toThrowError(/The FieldArray needs a valid "fieldId" property to  function correctly./);
    });
  });
});
